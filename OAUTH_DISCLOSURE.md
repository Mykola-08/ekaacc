# OAuth Integration Disclosure

**Last Updated:** November 20, 2025

This disclosure provides detailed information about how EKA Account uses OAuth integrations, particularly with Google services, to comply with transparency requirements and Google's API Services User Data Policy.

---

## Overview

EKA Account uses OAuth 2.0 authentication to allow users to sign in with their existing accounts from trusted providers (Google, GitHub, etc.) and to optionally access certain features of those services to enhance functionality within our platform.

---

## Google OAuth Integration

### What We Access

When you choose to connect your Google account, we request access to the following data based on the features you choose to use:

#### Always Requested (Authentication)
- **OpenID**: To verify your identity
- **Email**: Your email address for account creation and communication
- **Profile**: Your name and profile picture for your account

#### Optional Scopes (Only When You Use Specific Features)
- **Google Calendar** (`calendar.readonly` or `calendar`): Access to your calendar events to display them within our platform and create new events on your behalf when you schedule appointments
- **Google Drive** (`drive.readonly`): Read-only access to files you choose to share through our platform
- **Gmail** (`gmail.readonly`): Read-only access to view messages and metadata for email integration features

### Why We Request These Permissions

| Scope | Purpose | User Benefit |
|-------|---------|-------------|
| Email & Profile | Account authentication and creation | Single sign-on convenience, no need to remember another password |
| Calendar | View and manage appointments | See your availability, schedule appointments directly in your calendar |
| Drive | Access shared files | View and reference files you choose to share |
| Gmail | View messages | Email integration features (if/when implemented) |

### How We Use Google Data

We use information received from Google APIs in strict compliance with the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

#### Permitted Uses
1. **Provide User-Facing Features**: Display calendar events, create appointments, access files
2. **Improve User Experience**: Optimize performance and fix bugs in features you use
3. **Security**: Detect and prevent security threats and abuse
4. **Comply with Law**: When required by applicable law or legal process

#### Prohibited Uses
1. ❌ **No Advertising**: We do NOT use Google user data for serving ads
2. ❌ **No Sale of Data**: We do NOT sell Google user data to third parties
3. ❌ **No Human Reading**: We do NOT allow humans to read your data unless:
   - You give explicit consent for support purposes
   - It's necessary for security (e.g., investigating abuse)
   - Required by law
4. ❌ **No Unauthorized Transfer**: We do NOT transfer Google user data to third parties except:
   - To provide user-facing features you request
   - As required by law
   - As part of a merger/acquisition (with notice to you)

### Limited Use Compliance

Our use of information received from Google APIs complies with [Google API Services User Data Policy Limited Use requirements](https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes).

**Specifically for Gmail data:**
- We will only use access to read, write, modify, or control Gmail message bodies (including attachments), metadata, headers, and settings to provide features explicitly requested by you
- We will not transfer this Gmail data to others unless:
  - Necessary to provide and improve user-facing features
  - Required to comply with applicable law
  - Part of a merger, acquisition, or sale of assets (with notice to you)

---

## Data Security

### Token Storage
- All OAuth tokens (access and refresh tokens) are encrypted in transit (TLS/SSL)
- Tokens are encrypted at rest in our database
- Row-Level Security (RLS) policies ensure users can only access their own tokens
- Tokens are never logged or exposed in client-side code

### Token Lifecycle
1. **Obtaining Tokens**: When you authorize access, we receive an access token and refresh token
2. **Storage**: Tokens are encrypted and stored in a secure database with RLS policies
3. **Usage**: Access tokens are used to make API calls on your behalf
4. **Refresh**: Expired access tokens are automatically refreshed using the refresh token
5. **Deletion**: When you disconnect, all tokens are immediately and permanently deleted

### Access Controls
- Only authenticated service backends can access OAuth tokens
- All API calls to Google services are server-side (tokens never exposed to browser)
- Client secrets are stored as environment variables, never in code
- Audit logging tracks all access to sensitive data

### Security Measures
- Regular security audits and penetration testing
- Automated vulnerability scanning
- Encryption in transit and at rest
- Multi-factor authentication for admin access
- Real-time monitoring and alerting

---

## User Rights and Controls

### Transparency
- You can view all connected OAuth providers in your [Privacy Controls](/privacy-controls)
- You can see what permissions (scopes) you've granted
- You can see when tokens expire

### Control
- **Revoke Access Anytime**: Disconnect OAuth providers at any time through:
  - Your account's [Privacy Controls](/privacy-controls)
  - [Google Account Permissions](https://myaccount.google.com/permissions)
- **Granular Permissions**: We only request scopes for features you actually use
- **Request Data Deletion**: Contact us to delete any data obtained through OAuth

### When You Disconnect
1. We immediately stop accessing data from that provider
2. All OAuth tokens are permanently deleted from our systems
3. No new data is accessed from that provider
4. Previously accessed data is retained per our retention policy unless you request deletion

---

## Data Retention

### OAuth Tokens
- **Active Connection**: Tokens retained while you maintain connection to the provider
- **Disconnection**: Tokens immediately deleted when you disconnect
- **Account Deletion**: All tokens deleted when you delete your account

### Data from Google Services
- **Calendar Events**: Retained while you use calendar features
- **Drive Files**: Cached copies deleted when no longer needed for active features
- **Gmail Data**: Retained only as long as necessary to provide requested features
- **User Request**: Deleted upon request within 30 days

---

## Third-Party Sharing

### Service Providers
We may share Google user data with service providers who:
- Are contractually bound to protect the data
- Use the data only to provide services to us
- Meet our security and privacy standards

Examples:
- **Hosting**: Supabase (database), Vercel (hosting)
- **Analytics**: For measuring feature usage (aggregated, anonymized)
- **Support**: Customer support tools (only when you contact support)

### No Sharing For
- ❌ Advertising networks
- ❌ Data brokers
- ❌ Marketing purposes
- ❌ AI training (except to improve features you use)

---

## Compliance

### Applicable Policies
- [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy)
- [Google OAuth 2.0 Policies](https://developers.google.com/identity/protocols/oauth2)
- GDPR (for EU users)
- CCPA (for California users)
- HIPAA (for healthcare data, with BAA)

### Our Commitments
1. ✅ Use Google data only for permitted purposes
2. ✅ Comply with Limited Use requirements
3. ✅ Implement appropriate security measures
4. ✅ Respect user privacy and choices
5. ✅ Provide transparency and control
6. ✅ Respond to user requests promptly
7. ✅ Undergo security assessments as required

---

## Privacy Policy & Terms

For complete details, please review:
- [Privacy Policy](/privacy) - How we collect, use, and protect your data
- [Terms of Service](/terms) - Legal agreement governing Service use
- [Privacy Controls](/privacy-controls) - Manage your privacy settings

---

## Contact & Support

### Questions About OAuth
Email: [support@ekabalance.com](mailto:support@ekabalance.com)

### Data Access Requests
Email: [support@ekabalance.com](mailto:support@ekabalance.com)
Include: "OAuth Data Request" in subject line

### Security Issues
Email: [support@ekabalance.com](mailto:support@ekabalance.com)
Include: "Security" in subject line

### Response Time
- General inquiries: 2-3 business days
- Data requests: 30 days maximum
- Security issues: 24 hours acknowledgment

---

## Verification Documentation

This document serves as the official OAuth disclosure for:

**Application Name**: EKA Account  
**Application Type**: Web Application  
**OAuth Scopes Requested**:
- `openid`
- `email`
- `profile`
- `https://www.googleapis.com/auth/calendar.readonly` (optional)
- `https://www.googleapis.com/auth/calendar` (optional)
- `https://www.googleapis.com/auth/drive.readonly` (optional)
- `https://www.googleapis.com/auth/gmail.readonly` (optional)

**Verification Status**: Pending/In Progress/Verified  
**Last Security Assessment**: [Date]  
**Next Assessment Due**: [Date]

---

## Change Log

| Date | Change | Version |
|------|--------|---------|
| 2025-11-20 | Initial OAuth disclosure created | 1.0 |

---

**Document Version**: 1.0  
**Last Review**: November 20, 2025  
**Next Review**: February 20, 2026
