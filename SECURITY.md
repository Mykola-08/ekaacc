# Security Guidelines for EKA Account Application

## Overview
This document outlines security best practices, configurations, and guidelines for the EKA Account application to ensure production-ready security.

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [Data Protection](#data-protection)
3. [API Security](#api-security)
4. [Database Security](#database-security)
5. [Environment & Configuration](#environment--configuration)
6. [Monitoring & Incident Response](#monitoring--incident-response)
7. [Compliance](#compliance)
8. [Security Checklist](#security-checklist)

---

## Authentication & Authorization

### Supabase Authentication
- ✅ Using Supabase Auth with secure JWT tokens
- ✅ Tokens stored in httpOnly cookies (not localStorage)
- ✅ Automatic token refresh implemented
- ✅ Session management with proper expiration

### Role-Based Access Control (RBAC)
```sql
-- Roles implemented:
- admin: Full system access
- user: Regular user permissions
- moderator: Content management permissions
- therapist: Client management permissions
```

### Password Policy
- Minimum 8 characters
- Enforce via Supabase Auth settings
- Password reset with email verification
- Account lockout after failed attempts (Supabase default)

### Best Practices
- ✅ Never store passwords in plain text
- ✅ Use Supabase's built-in password hashing (bcrypt)
- ✅ Implement MFA for admin accounts (TODO)
- ✅ Session timeout after inactivity
- ✅ Secure password reset flow

### Implementation Example
```typescript
// Protected route check
import { createClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check permissions
  const { data: roles } = await supabase
    .from('user_role_assignments')
    .select('role:user_roles(name)')
    .eq('user_id', user.id);
  
  // Your logic here
}
```

---

## Data Protection

### Encryption

#### In Transit
- ✅ HTTPS enforced in production
- ✅ TLS 1.2+ required
- ✅ HSTS headers configured
- ✅ Secure WebSocket connections (WSS)

#### At Rest
- ✅ Database encryption via Supabase (AES-256)
- ✅ Backup encryption enabled
- ✅ Sensitive fields can use additional encryption (TODO)

### Row Level Security (RLS)
All tables have RLS enabled with policies:

```sql
-- Example: User can only see their own data
CREATE POLICY "Users can view own data" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Example: Admin can see all data
CREATE POLICY "Admins can view all" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() AND ur.name = 'admin'
    )
  );
```

### Personal Data Protection
- User profiles: Name, email, phone (PII)
- Journal entries: Private by default
- Session notes: Encrypted, access controlled
- Payment data: Tokenized via Stripe/Square (never stored)

### Data Retention
- User data: Retained while account is active
- Deleted accounts: 30-day soft delete before permanent removal
- Backup retention: 90 days
- Audit logs: 1 year retention

---

## API Security

### Rate Limiting
Implemented via `src/lib/rate-limit.ts`:

```typescript
// Standard endpoints: 100 requests/minute
// Auth endpoints: 10 requests/minute
// AI endpoints: 20 requests/minute
// Upload endpoints: 10 requests/minute
```

### API Route Protection
```typescript
import { rateLimitConfigs } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    await rateLimitConfigs.api.check(request, 10);
    
    // Your logic here
  } catch (error) {
    if (error === 'RATE_LIMIT_EXCEEDED') {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
  }
}
```

### Input Validation
- ✅ Using Zod for schema validation
- ✅ Sanitize user inputs
- ✅ Validate file uploads (type, size)
- ✅ SQL injection prevention (using Supabase client)
- ✅ XSS prevention (React escapes by default)

### CORS Configuration
```typescript
// Only allow requests from your domain
const allowedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL,
  'https://your-domain.com',
];
```

### API Keys
- ✅ Never expose in client code
- ✅ Stored in environment variables
- ✅ Server-side only for sensitive operations
- ✅ Rotate regularly (every 90 days)

---

## Database Security

### Connection Security
- ✅ Connection string in environment variables
- ✅ SSL/TLS required for connections
- ✅ Connection pooling configured
- ✅ Service role key protected

### Query Security
- ✅ Parameterized queries (Supabase client)
- ✅ RLS policies enforce access control
- ✅ Prepared statements used
- ✅ No dynamic SQL from user input

### Backup & Recovery
- ✅ Automated daily backups (Supabase)
- ✅ Point-in-time recovery enabled
- ✅ Backup encryption enabled
- ✅ Test restore procedure monthly

### Audit Logging
```sql
-- All sensitive operations logged
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Environment & Configuration

### Environment Variables

#### Required Security Practices
1. **Never commit** `.env` files to git
2. **Use different keys** for dev/staging/production
3. **Rotate keys** every 90 days
4. **Use secrets manager** in production

#### Sensitive Variables
```bash
# Never commit these:
SUPABASE_SERVICE_ROLE_KEY=super_secret_key
STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
NEXTAUTH_SECRET=very_long_random_string
DATABASE_URL=postgresql://...
```

#### Environment Validation
Create `src/lib/env.ts`:
```typescript
function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }
}

validateEnv();
```

### Security Headers
Configured in `next.config.ts`:
```typescript
headers: [
  'Strict-Transport-Security',
  'X-Frame-Options: DENY',
  'X-Content-Type-Options: nosniff',
  'X-XSS-Protection: 1; mode=block',
  'Referrer-Policy: strict-origin-when-cross-origin',
  'Permissions-Policy: camera=(), microphone=()',
]
```

---

## Monitoring & Incident Response

### Error Tracking
- ✅ Error boundary implemented
- ✅ Server-side error logging
- 📋 TODO: Sentry integration
- 📋 TODO: Alert configuration

### Security Monitoring
- 📋 Monitor failed login attempts
- 📋 Track privilege escalation attempts
- 📋 Alert on unusual API patterns
- 📋 Monitor rate limit violations

### Incident Response Plan

#### 1. Detection
- Automated alerts for security events
- User reports
- Security scanning tools

#### 2. Containment
- Revoke compromised credentials immediately
- Block malicious IP addresses
- Disable affected features if needed

#### 3. Investigation
- Review audit logs
- Check database for unauthorized access
- Analyze attack patterns

#### 4. Recovery
- Restore from backups if needed
- Apply security patches
- Reset affected user passwords

#### 5. Post-Incident
- Document the incident
- Update security measures
- Notify affected users if required

### Logging Best Practices
```typescript
// Good logging
logger.info('User login successful', { userId, timestamp });

// Bad logging (don't log sensitive data)
logger.info('User login', { userId, password }); // ❌ Never log passwords
logger.info('API key used', { apiKey }); // ❌ Never log API keys
```

---

## Compliance

### GDPR Compliance
- ✅ User data export functionality (TODO)
- ✅ Right to deletion (soft delete implemented)
- ✅ Data processing consent
- ✅ Privacy policy available
- 📋 TODO: Cookie consent banner
- 📋 TODO: Data processing agreement

### HIPAA Compliance (if handling health data)
- ⚠️ Requires Business Associate Agreement
- ⚠️ Additional encryption required
- ⚠️ Audit trail requirements
- ⚠️ Access controls must be stricter
- 📋 Consult legal team before implementing

### Data Location
- Database: US/EU regions available (Supabase)
- Specify region based on user location
- Document data residency

---

## Security Checklist

### Pre-Production
- [ ] All environment variables set correctly
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] RLS policies tested
- [ ] Authentication flows tested
- [ ] Password reset flow tested
- [ ] Error handling doesn't expose sensitive info
- [ ] API keys rotated from development keys
- [ ] Backup and recovery tested
- [ ] Security scan completed (npm audit)
- [ ] Dependency vulnerabilities addressed
- [ ] CORS configured correctly
- [ ] CSP headers set
- [ ] File upload limits set

### Post-Deployment
- [ ] Monitor error rates
- [ ] Review access logs
- [ ] Check for unusual patterns
- [ ] Verify backup schedule running
- [ ] Test disaster recovery
- [ ] Review user permissions
- [ ] Audit admin access
- [ ] Check rate limit effectiveness

### Regular Maintenance (Monthly)
- [ ] Review audit logs
- [ ] Check for outdated dependencies
- [ ] Update security patches
- [ ] Review and rotate API keys
- [ ] Test backup restoration
- [ ] Review access permissions
- [ ] Update security documentation

### Quarterly Tasks
- [ ] Security audit
- [ ] Penetration testing
- [ ] Review compliance requirements
- [ ] Update privacy policy
- [ ] Security awareness training
- [ ] Disaster recovery drill

---

## Common Security Issues & Solutions

### Issue: Session Hijacking
**Prevention:**
- Use httpOnly cookies
- Implement CSRF protection
- Short session lifetime
- IP validation (optional)

### Issue: SQL Injection
**Prevention:**
- Use Supabase client (parameterized queries)
- Never concatenate user input into queries
- Use RLS policies

### Issue: XSS Attacks
**Prevention:**
- React escapes by default
- Sanitize HTML inputs
- Content Security Policy headers
- Validate and escape user content

### Issue: CSRF Attacks
**Prevention:**
- SameSite cookie attribute
- CSRF tokens for state-changing operations
- Verify origin header

### Issue: API Key Exposure
**Prevention:**
- Never commit to git
- Use environment variables
- Separate client/server keys
- Implement key rotation

---

## Resources

### Tools
- **npm audit**: Check for vulnerable dependencies
- **Snyk**: Continuous security monitoring
- **OWASP ZAP**: Security testing
- **Supabase Dashboard**: RLS policy testing

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#security)

### Contacts
- Security incidents: security@your-domain.com
- Privacy concerns: privacy@your-domain.com

---

**Last Updated:** 2024-11-17  
**Version:** 1.0  
**Review Schedule:** Quarterly
