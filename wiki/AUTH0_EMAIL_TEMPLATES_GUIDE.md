# Auth0 Email Templates Deployment Guide

## Overview

This guide explains how to deploy branded email templates to your Auth0 tenant. The templates are located in the `auth0/email-templates/` directory and feature the EKA Account branding with the primary blue color (#4F7CFF).

## Available Templates

### 1. **verify-email.html** - Email Verification
- **Purpose**: Sent when a user signs up and needs to verify their email
- **Variables**: `{{ url }}` - verification link
- **Template Type**: `verify_email`

### 2. **welcome-email.html** - Welcome Email  
- **Purpose**: Sent after successful email verification
- **Variables**: `{{ user.name }}` - user's name
- **Template Type**: `welcome_email`

### 3. **change-password.html** - Password Reset
- **Purpose**: Sent when a user requests a password reset
- **Variables**: 
  - `{{ url }}` - password reset link
  - `{{ user.name }}` - user's name
- **Template Type**: `change_password`

### 4. **blocked-account.html** - Account Blocked
- **Purpose**: Sent when account is blocked due to suspicious activity
- **Variables**: 
  - `{{ url }}` - account unblock link
  - `{{ user.name }}` - user's name
- **Template Type**: `blocked_account`

## Deployment Methods

### Method 1: Via Auth0 Dashboard (Recommended)

1. **Navigate to Email Templates**
   - Log in to your [Auth0 Dashboard](https://manage.auth0.com)
   - Go to **Branding** → **Email Templates**

2. **Configure Each Template**
   - Select the template type from the dropdown
   - Toggle "Customize Template" to ON
   - Copy the content from the corresponding HTML file
   - Paste it into the template editor
   - Configure the following settings:
     - **Subject Line**: Set an appropriate subject
     - **From Name**: `EKA Account`
     - **From Email**: Use your verified sending email (e.g., `noreply@ekabalance.com`)
     - **Result URL**: `https://ekaacc-1.vercel.app` (for production: `https://ekabalance.com`)
     - **URL Lifetime**: Default is 432000 seconds (5 days) - adjust as needed
   - Click **Save**

3. **Test the Template**
   - Click "Send Test Email" to preview
   - Enter a test email address
   - Verify the template displays correctly

### Method 2: Via Auth0 Management API

For programmatic deployment, use the Auth0 Management API:

```bash
# Get an access token first
curl --request POST \\
  --url https://YOUR_DOMAIN.auth0.com/oauth/token \\
  --header 'content-type: application/json' \\
  --data '{
    "client_id":"YOUR_CLIENT_ID",
    "client_secret":"YOUR_CLIENT_SECRET",
    "audience":"https://YOUR_DOMAIN.auth0.com/api/v2/",
    "grant_type":"client_credentials"
  }'

# Update email template
curl --request PATCH \\
  --url https://YOUR_DOMAIN.auth0.com/api/v2/email-templates/verify_email \\
  --header 'authorization: Bearer YOUR_ACCESS_TOKEN' \\
  --header 'content-type: application/json' \\
  --data '{
    "template": "<HTML_TEMPLATE_CONTENT>",
    "from": "noreply@ekabalance.com",
    "subject": "Verify Your Email Address",
    "syntax": "liquid",
    "body": "...",
    "enabled": true
  }'
```

### Method 3: Using Auth0 CLI

```bash
# Install Auth0 CLI
npm install -g auth0-cli

# Login
auth0 login

# Update template
auth0 api patch email-templates/verify_email \\
  --data '{"template": "..."}' \\
  --from-file auth0/email-templates/verify-email.html
```

## Template Variables Reference

Auth0 email templates support Liquid syntax. Common variables:

- `{{ user.name }}` - User's full name
- `{{ user.email }}` - User's email address  
- `{{ user.picture }}` - User's profile picture URL
- `{{ url }}` - Action URL (verification, password reset, etc.)
- `{{ application.name }}` - Application name

## Email Subjects (Recommended)

- **Verify Email**: "Verify Your Email Address - EKA Account"
- **Welcome Email**: "Welcome to EKA Account! 🌟"
- **Change Password**: "Reset Your Password - EKA Account"
- **Blocked Account**: "Account Security Alert - EKA Account"

## Email Provider Configuration

### Using Auth0's Built-in Provider
Auth0 provides basic email delivery out of the box, but has limitations.

### Using Custom SMTP (Recommended for Production)

1. Go to **Auth0 Dashboard** → **Branding** → **Email Provider**
2. Select **Use my own Email Provider**
3. Configure your SMTP settings (recommended: SendGrid, Amazon SES, or Mailgun)
4. Example for SendGrid:
   ```
   SMTP Host: smtp.sendgrid.net
   SMTP Port: 587
   SMTP User: apikey
   SMTP Password: YOUR_SENDGRID_API_KEY
   ```

### Using Resend (Alternative)

You can also use Resend for Auth0 emails:

1. Get your Resend API key from https://resend.com
2. Configure SMTP in Auth0:
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 587
   SMTP User: resend
   SMTP Password: YOUR_RESEND_API_KEY
   ```

## Branding Consistency

All templates use the EKA Account brand identity:

- **Primary Color**: #4F7CFF (brand blue)
- **Secondary Color**: #3B5FCC (darker blue)
- **Logo**: https://ekaacc-1.vercel.app/eka_logo.png
- **Font**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Design**: Modern, clean with gradient accent bar

## Testing Checklist

Before deploying to production:

- [ ] Test on desktop email clients (Outlook, Thunderbird, Apple Mail)
- [ ] Test on webmail (Gmail, Outlook.com, Yahoo)
- [ ] Test on mobile devices (iOS Mail, Gmail app, Outlook app)
- [ ] Verify all links work correctly
- [ ] Check email deliverability (not landing in spam)
- [ ] Test with actual user flow (sign up, password reset, etc.)
- [ ] Verify from address is properly authenticated (SPF, DKIM)

## Troubleshooting

### Emails Not Sending
1. Check Auth0 logs: Dashboard → Monitoring → Logs
2. Verify email provider configuration
3. Check domain authentication (SPF, DKIM, DMARC records)
4. Ensure sending email is verified

### Template Not Updating
1. Clear browser cache
2. Hard refresh (Ctrl+F5 or Cmd+Shift+R)
3. Wait a few minutes for changes to propagate
4. Check for HTML syntax errors

### Links Not Working
1. Verify `{{ url }}` variable is properly placed
2. Check Result URL in template settings
3. Ensure application callback URLs are configured

## Related Documentation

- [Auth0 Email Templates Documentation](https://auth0.com/docs/customize/email/email-templates)
- [Liquid Template Language](https://shopify.github.io/liquid/)
- [Email Provider Configuration](https://auth0.com/docs/customize/email/email-providers)

## Support

For assistance with email template deployment:
- Auth0 Community: https://community.auth0.com
- Auth0 Support: https://support.auth0.com
- Internal: Contact the development team
