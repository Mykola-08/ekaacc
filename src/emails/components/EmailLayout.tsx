import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Img,
  Hr,
} from '@react-email/components';

interface EmailLayoutProps {
  preview?: string;
  children: React.ReactNode;
  unsubscribeUrl?: string;
}

// Brand colors from design system
const BRAND_COLORS = {
  primary: '#4F7CFF',
  primaryDark: '#3B5FCC',
  text: '#1F2937',
  textLight: '#6B7280',
  background: '#F9FAFB',
  border: '#E5E7EB',
};

export const EmailLayout = ({ preview, children, unsubscribeUrl }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Body style={main}>
        <Container style={container}>
          {/* Header with gradient accent */}
          <Section style={headerAccent} />
          <Section style={header}>
            <Img
              src="https://ekaacc-1.vercel.app/eka_logo.png"
              width="48"
              height="48"
              alt="EKA Account"
              style={logo}
            />
            <Text style={brandName}>EKA Account</Text>
            <Text style={tagline}>Mental Health & Wellness Platform</Text>
          </Section>
          
          <Section style={content}>
            {children}
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} EKA Account. All rights reserved.
            </Text>
            <Text style={footerText}>
              Your mental health and wellness companion
            </Text>
            <Text style={footerLinks}>
              <Link href="https://ekaacc-1.vercel.app" style={footerLink}>
                Visit Website
              </Link>
              {' • '}
              <Link href="https://ekaacc-1.vercel.app/help" style={footerLink}>
                Help Center
              </Link>
              {' • '}
              <Link href="https://ekaacc-1.vercel.app/privacy" style={footerLink}>
                Privacy
              </Link>
              {unsubscribeUrl && (
                <>
                  {' • '}
                  <Link href={unsubscribeUrl} style={footerLink}>
                    Unsubscribe
                  </Link>
                </>
              )}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: BRAND_COLORS.background,
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  marginBottom: '32px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  maxWidth: '600px',
  overflow: 'hidden',
};

const headerAccent = {
  height: '4px',
  background: `linear-gradient(90deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%)`,
};

const header = {
  padding: '32px 24px 24px',
  textAlign: 'center' as const,
  borderBottom: `1px solid ${BRAND_COLORS.border}`,
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const brandName = {
  fontSize: '28px',
  fontWeight: '700',
  color: BRAND_COLORS.text,
  margin: '16px 0 4px',
  letterSpacing: '-0.02em',
};

const tagline = {
  fontSize: '14px',
  color: BRAND_COLORS.textLight,
  margin: '0',
  fontWeight: '500',
};

const content = {
  padding: '40px 32px',
};

const hr = {
  borderColor: BRAND_COLORS.border,
  margin: '0',
};

const footer = {
  padding: '32px 24px',
  textAlign: 'center' as const,
  backgroundColor: '#F9FAFB',
};

const footerText = {
  fontSize: '13px',
  color: BRAND_COLORS.textLight,
  margin: '4px 0',
  lineHeight: '20px',
};

const footerLinks = {
  fontSize: '12px',
  color: BRAND_COLORS.textLight,
  margin: '12px 0 0',
  lineHeight: '20px',
};

const footerLink = {
  color: BRAND_COLORS.primary,
  textDecoration: 'none',
  fontWeight: '500',
};
