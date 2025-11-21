import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface PromotionalEmailProps {
  userName?: string;
  offerTitle: string;
  offerDetails: string;
  promoCode?: string;
  validUntil?: string;
  ctaLink: string;
  ctaText?: string;
  unsubscribeUrl?: string;
}

export const PromotionalEmail = ({
  userName,
  offerTitle,
  offerDetails,
  promoCode,
  validUntil,
  ctaLink,
  ctaText = 'Claim Offer',
  unsubscribeUrl,
}: PromotionalEmailProps) => {
  return (
    <EmailLayout preview={offerTitle} unsubscribeUrl={unsubscribeUrl}>
      <Heading style={h1}>{offerTitle}</Heading>
      <Text style={text}>
        Hi {userName || 'there'},
      </Text>
      <Text style={text}>
        We have a special offer just for you!
      </Text>
      <Section style={offerContainer}>
        <Text style={offerText}>
          {offerDetails}
        </Text>
        {promoCode && (
          <Section style={codeContainer}>
            <Text style={codeLabel}>Use Code:</Text>
            <Text style={code}>{promoCode}</Text>
          </Section>
        )}
        {validUntil && (
          <Text style={validityText}>
            Valid until: {validUntil}
          </Text>
        )}
      </Section>
      <Section style={btnContainer}>
        <Button style={button} href={ctaLink}>
          {ctaText}
        </Button>
      </Section>
    </EmailLayout>
  );
};

export default PromotionalEmail;

const h1 = {
  color: '#1F2937',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.3',
  marginBottom: '20px',
  letterSpacing: '-0.02em',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '16px',
};

const offerContainer = {
  backgroundColor: '#F0F5FF',
  borderRadius: '12px',
  border: '2px solid #4F7CFF',
  padding: '24px',
  marginTop: '24px',
  marginBottom: '24px',
};

const offerText = {
  color: '#1F2937',
  fontSize: '18px',
  lineHeight: '1.6',
  marginBottom: '20px',
  fontWeight: '500',
  textAlign: 'center' as const,
};

const codeContainer = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '16px',
  textAlign: 'center' as const,
  marginTop: '16px',
  marginBottom: '16px',
};

const codeLabel = {
  color: '#6B7280',
  fontSize: '14px',
  marginBottom: '8px',
  fontWeight: '500',
  textTransform: 'uppercase' as const,
};

const code = {
  color: '#4F7CFF',
  fontSize: '24px',
  fontWeight: '700',
  fontFamily: 'monospace',
  letterSpacing: '0.1em',
  margin: '0',
};

const validityText = {
  color: '#6B7280',
  fontSize: '14px',
  textAlign: 'center' as const,
  marginTop: '12px',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '28px',
};

const button = {
  backgroundColor: '#4F7CFF',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  boxShadow: '0 4px 6px -1px rgba(79, 124, 255, 0.3)',
};

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '16px',
};

const offerContainer = {
  backgroundColor: '#fff8f0',
  border: '1px solid #fed7aa',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const offerText = {
  color: '#9a3412',
  fontSize: '18px',
  fontWeight: '500',
  marginBottom: '16px',
};

const codeContainer = {
  background: '#ffffff',
  border: '1px dashed #9a3412',
  borderRadius: '4px',
  padding: '12px',
  display: 'inline-block',
  marginBottom: '12px',
};

const codeLabel = {
  color: '#666',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  marginBottom: '4px',
};

const code = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '700',
  fontFamily: 'monospace',
  margin: '0',
};

const validityText = {
  color: '#666',
  fontSize: '14px',
  marginTop: '12px',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#ea580c',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};
