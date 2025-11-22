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
  Link,
} from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface ProductLaunchEmailProps {
  userName?: string;
  productName: string;
  productDescription: string;
  launchDate: string;
  ctaLink: string;
  ctaText?: string;
  unsubscribeUrl?: string;
}

export const ProductLaunchEmail = ({
  userName,
  productName,
  productDescription,
  launchDate,
  ctaLink,
  ctaText = 'Check it out',
  unsubscribeUrl,
}: ProductLaunchEmailProps) => {
  return (
    <EmailLayout preview={`Introducing ${productName}`} unsubscribeUrl={unsubscribeUrl}>
      <Heading style={h1}>🚀 Introducing {productName}</Heading>
      <Text style={text}>
        Hi {userName || 'there'},
      </Text>
      <Text style={text}>
        We are thrilled to announce the launch of <strong>{productName}</strong>!
      </Text>
      <Text style={text}>
        {productDescription}
      </Text>
      <Section style={highlightSection}>
        <Text style={highlightText}>
          <strong>Launch Date:</strong> {launchDate}
        </Text>
      </Section>
      <Section style={btnContainer}>
        <Button style={button} href={ctaLink}>
          {ctaText}
        </Button>
      </Section>
      <Text style={text}>
        Thank you for being part of our journey.
      </Text>
    </EmailLayout>
  );
};

export default ProductLaunchEmail;

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

const highlightSection = {
  backgroundColor: '#F0F5FF',
  borderLeft: '4px solid #4F7CFF',
  borderRadius: '4px',
  padding: '16px 20px',
  marginTop: '24px',
  marginBottom: '24px',
};

const highlightText = {
  color: '#1F2937',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '28px',
  marginBottom: '20px',
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

// Duplicate style block removed (initial definitions retained for consistency)
