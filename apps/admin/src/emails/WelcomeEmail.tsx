import * as React from 'react';
import { Text, Button, Section, Heading } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface WelcomeEmailProps {
  name: string;
  actionUrl: string;
}

export const WelcomeEmail = ({ name, actionUrl }: WelcomeEmailProps) => {
  return (
    <EmailLayout preview="Welcome to EKA Account - Your Mental Health Journey Begins!">
      <Heading style={h1}>Welcome to EKA Account, {name}!</Heading>
      <Text style={text}>
        We're thrilled to have you join our mental health and wellness community. You've taken an important step toward better mental well-being, and we're here to support you every step of the way.
      </Text>
      <Text style={text}>
        With EKA Account, you can:
      </Text>
      <Text style={listItem}>✓ Track your mood and journal privately</Text>
      <Text style={listItem}>✓ Set and achieve wellness goals</Text>
      <Text style={listItem}>✓ Connect with certified therapists</Text>
      <Text style={listItem}>✓ Get AI-powered personalized insights</Text>
      <Section style={buttonContainer}>
        <Button style={button} href={actionUrl}>
          Start Your Journey
        </Button>
      </Section>
      <Text style={text}>
        If you have any questions, our support team is always here to help. Simply reply to this email or visit our Help Center.
      </Text>
    </EmailLayout>
  );
};

const h1 = {
  color: '#1F2937',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 24px',
  letterSpacing: '-0.02em',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const listItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 8px',
  paddingLeft: '8px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
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

export default WelcomeEmail;
