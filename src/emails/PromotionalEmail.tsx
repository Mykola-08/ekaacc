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
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
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
