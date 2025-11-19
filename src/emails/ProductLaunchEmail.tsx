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

const highlightSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const highlightText = {
  color: '#1a1a1a',
  fontSize: '16px',
  margin: '0',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};
