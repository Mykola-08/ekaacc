# Auth0 + Supabase Row Level Security (RLS) Policies

This document provides recommended patterns for enforcing per-user data access using Auth0-issued JWTs with Supabase.

---
## 1. JWT Claims Mapping
Auth0 ID tokens enriched by the Post-Login Action include a custom claim namespace:
```
https://supabase.io/jwt/claims: {
  user_id: "auth0|abc123",
  email: "user@example.com",
  role: "user"
}
```
Supabase exposes raw JWT via `current_setting('request.jwt.claims', true)`; keys are accessible with JSON operators.

---
## 2. Helper Functions (Recommended)
Already created in migration:
```sql
CREATE OR REPLACE FUNCTION public.current_user_id() RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json->>'user_id',
    current_setting('request.jwt.claims', true)::json->>'sub'
  );
END; $$ LANGUAGE plpgsql SECURITY DEFINER;
```
Add role extractor:
```sql
CREATE OR REPLACE FUNCTION public.current_user_role() RETURNS TEXT AS $$
DECLARE
  claims JSON;
BEGIN
  claims := current_setting('request.jwt.claims', true)::json;
  RETURN COALESCE(
    (claims->'https://supabase.io/jwt/claims'->>'role'),
    (claims->>'role'),
    'user'
  );
END; $$ LANGUAGE plpgsql SECURITY DEFINER;
```

---
## 3. Example Table Policies
For a table storing user-owned records (e.g. `profiles`):
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles Select Own" ON public.profiles;
CREATE POLICY "Profiles Select Own"
  ON public.profiles FOR SELECT
  USING (user_id = public.current_user_id());

DROP POLICY IF EXISTS "Profiles Update Own" ON public.profiles;
CREATE POLICY "Profiles Update Own"
  ON public.profiles FOR UPDATE
  USING (user_id = public.current_user_id());
```

---
## 4. Role-Based Access Control (RBAC)
If roles are injected (`admin`, `practitioner`, `support`) and multiple scopes exist, add layered policies:
```sql
-- Admin bypass read/write
CREATE POLICY "Profiles Admin Full"
  ON public.profiles FOR ALL
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- Practitioner read limited fields (example view or column-level approach via SECURITY DEFINER functions)
CREATE POLICY "Profiles Practitioner Read"
  ON public.profiles FOR SELECT
  USING (public.current_user_role() = 'practitioner');
```

Combine with API scopes (from Auth0 resource server):
```sql
CREATE POLICY "Profiles Manage Users Scope"
  ON public.profiles FOR UPDATE USING (
    public.current_user_role() = 'admin' OR (
      position('manage:users' in current_setting('request.jwt.claims', true)::json->>'scope') > 0
    )
  );
```

Ordering does not matter; Postgres ORs applicable policies of same command.

---
## 5. Multi-Tenant Pattern
Introduce `tenant_id` on tables and encode tenant claim:
Action update snippet:
```js
api.idToken.setCustomClaim('https://supabase.io/jwt/claims', {
  user_id: userId,
  tenant_id: event.user.app_metadata?.tenant_id || 'default',
  role: roles[0]
});
```
Policy:
```sql
CREATE POLICY "Tenant Isolation"
  ON public.profiles FOR SELECT USING (
    tenant_id = (current_setting('request.jwt.claims', true)::json
      ->'https://supabase.io/jwt/claims'->>'tenant_id')
  );
```

Optional cross-tenant admin access:
```sql
CREATE POLICY "Tenant Admin Override"
  ON public.profiles FOR SELECT USING (
    public.current_user_role() = 'admin'
  );
```

---
## 6. Prevent Anonymous Access
Do not grant `anon` role if table should be private:
```sql
REVOKE SELECT ON public.profiles FROM anon;
```

---
## 7. Auditing & Soft Deletes
Add audit triggers capturing `public.current_user_id()` for created_by / updated_by fields.

---
## 8. Verification Queries
```sql
SELECT current_user_id(), current_user_role();
SELECT current_setting('request.jwt.claims', true);
```
If `current_user_id()` is NULL, JWT configuration or action claims might be missing.

---
## 9. Common Pitfalls
| Problem | Cause | Fix |
|---------|-------|-----|
| Policy never matches | Claim key mismatch | Inspect raw claims; adjust JSON path |
| Admin access fails | Role claim not in namespace | Ensure action sets namespaced role |
| Unauthorized after domain change | Issuer mismatch in Supabase settings | Update JWT Issuer + JWKS URL to custom domain |

---
## 10. Next Steps
- Integrate role management in Auth0 (Rules / Actions or Dashboard) for admin provisioning.
- Add periodic script to reconcile Auth0 app_metadata roles with Supabase.
- Expand policies for write operations with finer scopes (e.g., separate update vs delete).

---
**Status:** Baseline RLS patterns documented for Auth0 JWT integration.
