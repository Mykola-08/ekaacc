import { createClient } from '@/lib/supabase/server';

export type FeatureNode = {
  id: string;
  key: string;
  parent_feature_id: string | null;
  default_enabled: boolean;
};

export type FeatureContext = {
  userId?: string;
  role?: string;
};

/**
 * Resolves all feature flags for a given context.
 * Returns a map of featureKey -> boolean.
 */
export async function resolveFeatures(context: FeatureContext): Promise<Record<string, boolean>> {
  const supabase = await createClient();

  // 1. Fetch all feature definitions
  const { data: features } = await supabase.from('features').select('*');
  if (!features || features.length === 0) return {};

  // 2. Fetch enrollments if user/role exists
  let enrollments: any[] = [];
  if (context.userId || context.role) {
    const query = supabase.from('feature_enrollments').select('*');
    const conditions: string[] = [];
    if (context.userId) conditions.push(`user_id.eq.${context.userId}`);
    if (context.role) conditions.push(`role.eq.${context.role}`);

    if (conditions.length > 0) {
      // Use .or() correctly with Supabase syntax
      const { data } = await query.or(conditions.join(','));
      enrollments = data || [];
    }
  }

  // 3. Build the tree and resolve
  const featureMap = new Map<string, FeatureNode>();
  features.forEach((f: any) => featureMap.set(f.id, f));

  const resolved = new Map<string, boolean>();

  // Helper to resolve a single feature (memoized in 'resolved')
  const resolveOne = (featureId: string): boolean => {
    const feature = featureMap.get(featureId);
    if (!feature) return false;

    // Check cache/already resolved
    if (resolved.has(feature.key)) return resolved.get(feature.key)!;

    // Check Parent first (Tree logic: Parent disabled => Child disabled)
    // Note: To prevent infinite loops in malformed trees, we should track visited nodes,
    // but assuming DB integrity for now.
    if (feature.parent_feature_id) {
      const parentEnabled = resolveOne(feature.parent_feature_id);
      if (!parentEnabled) {
        resolved.set(feature.key, false);
        return false;
      }
    }

    // Check User Enrollment (Highest Priority)
    const userEnrollment = enrollments.find(
      (e: any) => e.feature_id === feature.id && e.user_id === context.userId
    );
    if (userEnrollment) {
      resolved.set(feature.key, userEnrollment.enabled);
      return userEnrollment.enabled;
    }

    // Check Role Enrollment (Medium Priority)
    const roleEnrollment = enrollments.find(
      (e: any) => e.feature_id === feature.id && e.role === context.role
    );
    if (roleEnrollment) {
      resolved.set(feature.key, roleEnrollment.enabled);
      return roleEnrollment.enabled;
    }

    // Default (Lowest Priority)
    resolved.set(feature.key, feature.default_enabled);
    return feature.default_enabled;
  };

  // Resolve all
  features.forEach((f: any) => resolveOne(f.id));

  return Object.fromEntries(resolved);
}

/**
 * Quick helper to check a single feature for the *current* user (from session).
 */
export async function getFeature(key: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // Fetch role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('auth_id', user.id)
    .single();
  const role = profile?.role;

  const features = await resolveFeatures({ userId: user.id, role });
  return features[key] ?? false;
}
