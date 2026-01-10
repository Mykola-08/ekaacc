import { DEFAULT_FEATURE_FLAGS } from '@/lib/platform/feature-flags';

export async function getAllFlags({ userId }: { userId: string }) {
  return DEFAULT_FEATURE_FLAGS;
}
