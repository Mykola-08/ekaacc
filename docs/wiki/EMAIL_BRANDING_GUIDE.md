# Email Branding Guide - EKA Account

## Overview

This guide documents the updated email branding and design system for EKA Account, covering all email templates across Resend, Supabase, and Auth0 platforms.

## Brand Identity

### Colors

- **Primary Blue**: `#4F7CFF` - Used for buttons, links, and primary accents
- **Primary Dark**: `#3B5FCC` - Used in gradients and hover states
- **Text Primary**: `#1F2937` - Main headings and important text
- **Text Secondary**: `#374151` - Body text
- **Text Muted**: `#6B7280` - Supporting text and footers
- **Background**: `#F9FAFB` - Email background
- **Border**: `#E5E7EB` - Dividers and borders

### Typography

- **Font Stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif`
- **Heading 1**: 26-28px, weight 700, letter-spacing -0.02em
- **Heading 2**: 18-20px, weight 700
- **Body Text**: 16px, line-height 1.6
- **Small Text**: 13-14px for footer content

### Logo

- **File**: `eka_logo.png`
- **Location**: `https://ekaacc-1.vercel.app/eka_logo.png`
- **Size in Emails**: 48x48px
- **Alt Text**: "EKA Account"

## Email Templates Structure

All emails follow a consistent structure:

### 1. Gradient Accent Bar
- 4px height
- Linear gradient from #4F7CFF to #3B5FCC

### 2. Header
- Logo (48x48px)
- Brand name "EKA Account"
- Tagline "Mental Health & Wellness Platform"
- Bottom border separator

### 3. Content Area
- 40px padding (top/bottom), 32px (left/right)
- Clear hierarchy with headings
- Call-to-action buttons
- Informational callout boxes where appropriate

### 4. Footer
- Copyright notice
- Tagline
- Navigation links (Website, Help Center, Privacy)
- Light gray background (#F9FAFB)

## Platform-Specific Templates

### Resend Templates (React Email)

**Location**: `src/emails/`

**Base Layout**: `src/emails/components/EmailLayout.tsx`

**Templates**:
1. `WelcomeEmail.tsx` - New user welcome
2. `NotificationEmail.tsx` - General notifications
3. `BroadcastEmail.tsx` - Marketing broadcasts
4. `ReminderEmail.tsx` - Appointment/task reminders
5. `PromotionalEmail.tsx` - Promotional offers with promo codes
6. `ProductLaunchEmail.tsx` - Feature announcements
7. `ResultEmail.tsx` - Test results or reports
8. `HomeworkEmail.tsx` - Therapist assignments
9. `CheckInEmail.tsx` - Therapist check-ins
10. `SessionNotesEmail.tsx` - Session summaries

**Usage Example**:
```typescript
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { render } from '@react-email/render';

const html = render(
  <WelcomeEmail 
    name="John Doe" 
    actionUrl="https://ekaacc-1.vercel.app/home" 
  />
);
```

### Supabase Templates (HTML)

**Location**: `supabase/templates/`

**Templates**:
1. `confirm_email.html` - Email verification
2. `reset_password.html` - Password reset
3. `magic_link.html` - Passwordless sign-in
4. `change_email.html` - Email change confirmation
5. `welcome.html` - Post-verification welcome

**Deployment**:
Update in Supabase Dashboard → Authentication → Email Templates

### Auth0 Templates (HTML)

**Location**: `auth0/email-templates/`

**Templates**:
1. `verify-email.html` - Email verification
2. `welcome-email.html` - Welcome message
3. `change-password.html` - Password reset
4. `blocked-account.html` - Account security alert

**Deployment**:
See [AUTH0_EMAIL_TEMPLATES_GUIDE.md](./AUTH0_EMAIL_TEMPLATES_GUIDE.md) for detailed deployment instructions.

## Button Styling

Standard branded button:

```css
background-color: #4F7CFF;
border-radius: 8px;
color: #ffffff;
font-size: 16px;
font-weight: 600;
text-decoration: none;
text-align: center;
padding: 14px 32px;
box-shadow: 0 4px 6px -1px rgba(79, 124, 255, 0.3);
```

### Button States
- **Hover**: Background #3B5FCC (darker blue)
- **Active**: Background #2E4BA0 (even darker)

## Callout Boxes

### Information (Blue)
```css
background-color: #DBEAFE;
border-left: 4px solid #4F7CFF;
border-radius: 4px;
padding: 16px 20px;
```

### Warning (Yellow)
```css
background-color: #FEF3C7;
border-left: 4px solid #F59E0B;
border-radius: 4px;
padding: 16px 20px;
```

### Error (Red)
```css
background-color: #FEE2E2;
border-left: 4px solid #EF4444;
border-radius: 4px;
padding: 16px 20px;
```

### Success (Green)
```css
background-color: #D1FAE5;
border-left: 4px solid #10B981;
border-radius: 4px;
padding: 16px 20px;
```

## Email Best Practices

### Content
- Keep subject lines under 50 characters
- Use emojis sparingly for emphasis
- Always include an unsubscribe link for marketing emails
- Provide clear call-to-action buttons
- Use personalization (name, etc.) when available

### Technical
- Max width: 600px for desktop compatibility
- Mobile-responsive design
- Inline CSS (for email client compatibility)
- Alt text for all images
- Fallback fonts specified

### Accessibility
- Minimum font size: 14px
- Color contrast ratio: 4.5:1 for body text
- Descriptive link text (avoid "click here")
- Semantic HTML structure

## Testing

Test all emails across:
- **Desktop Clients**: Outlook, Apple Mail, Thunderbird
- **Webmail**: Gmail, Outlook.com, Yahoo Mail
- **Mobile**: iOS Mail, Gmail app, Outlook app

### Testing Tools
- [Litmus](https://litmus.com) - Email testing platform
- [Email on Acid](https://www.emailonacid.com) - Email previews
- [MailHog](https://github.com/mailhog/MailHog) - Local email testing

## Maintenance

### Updating Templates

1. **For React Email (Resend)**:
   - Edit files in `src/emails/`
   - Update `EmailLayout.tsx` for global changes
   - Run `npm run email:dev` to preview locally

2. **For Supabase**:
   - Edit HTML files in `supabase/templates/`
   - Upload via Supabase Dashboard
   - Test via the Auth flow

3. **For Auth0**:
   - Edit HTML files in `auth0/email-templates/`
   - Update via Auth0 Dashboard or API
   - See AUTH0_EMAIL_TEMPLATES_GUIDE.md

### Version Control
- All templates are version-controlled in the repository
- Document significant changes in commit messages
- Test before deploying to production

## Support Links

Standard footer links:
- **Website**: https://ekaacc-1.vercel.app (Dev) / https://ekabalance.com (Prod)
- **Help Center**: /help
- **Privacy Policy**: /privacy

## Migration Notes

### Previous Design → New Design
- Changed from black (#000000) buttons to brand blue (#4F7CFF)
- Added gradient accent bar at top
- Increased logo size from 40px to 48px
- Added tagline "Mental Health & Wellness Platform"
- Updated footer with more links and branding
- Improved mobile responsiveness
- Enhanced visual hierarchy with better spacing

## Related Documentation

- [RESEND_INTEGRATION.md](./RESEND_INTEGRATION.md) - Resend email service
- [SUPABASE_EMAIL_SETUP.md](./SUPABASE_EMAIL_SETUP.md) - Supabase email configuration
- [AUTH0_EMAIL_TEMPLATES_GUIDE.md](./AUTH0_EMAIL_TEMPLATES_GUIDE.md) - Auth0 deployment
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Overall design system
