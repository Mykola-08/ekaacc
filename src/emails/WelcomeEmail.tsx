import * as React from 'react';
import { Text, Button, Section, Heading } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface WelcomeEmailProps {
  name: string;
  actionUrl: string;
}

export const WelcomeEmail = ({ name, actionUrl }: WelcomeEmailProps) => {
  return (
    <EmailLayout preview="Welcome to Ekaacc!">
      <Heading style={h1}>Welcome, {name}!</Heading>
      <Text style={text}>
        We're excited to have you on board. Ekaacc is designed to help you manage your account efficiently and securely.
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href={actionUrl}>
          Get Started
        </Button>
      </Section>
      <Text style={text}>
        If you have any questions, feel free to reply to this email or contact our support team.
      </Text>
    </EmailLayout>
  );
};

const h1 = {
  color: '#111827',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  margin: '0 0 24px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 24px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

export default WelcomeEmail;
