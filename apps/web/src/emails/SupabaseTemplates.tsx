import * as React from 'react';
import { Text, Button, Section, Heading, Link } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

// 1. Confirm Email
export const ConfirmEmail = () => {
  return (
    <EmailLayout preview="Confirm your email address">
      <Heading style={h1}>Confirm your email address</Heading>
      <Text style={text}>
        Welcome to Ekaacc! Please confirm your email address to get started.
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href="{{ .ConfirmationURL }}">
          Confirm Email
        </Button>
      </Section>
      <Text style={text}>
        If you didn't request this, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
};

// 2. Reset Password
export const ResetPasswordEmail = () => {
  return (
    <EmailLayout preview="Reset your password">
      <Heading style={h1}>Reset your password</Heading>
      <Text style={text}>
        We received a request to reset your password. Click the button below to choose a new one.
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href="{{ .ConfirmationURL }}">
          Reset Password
        </Button>
      </Section>
      <Text style={text}>
        If you didn't request a password reset, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
};

// 3. Magic Link
export const MagicLinkEmail = () => {
  return (
    <EmailLayout preview="Sign in to Ekaacc">
      <Heading style={h1}>Sign in to Ekaacc</Heading>
      <Text style={text}>
        Click the button below to sign in to your account.
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href="{{ .ConfirmationURL }}">
          Sign In
        </Button>
      </Section>
      <Text style={text}>
        If you didn't request this, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
};

// 4. Change Email Address
export const ChangeEmailAddressEmail = () => {
  return (
    <EmailLayout preview="Confirm email change">
      <Heading style={h1}>Confirm email change</Heading>
      <Text style={text}>
        Please confirm your new email address by clicking the button below.
      </Text>
      <Section style={buttonContainer}>
        <Button style={button} href="{{ .ConfirmationURL }}">
          Confirm Change
        </Button>
      </Section>
      <Text style={text}>
        If you didn't request this change, please contact support immediately.
      </Text>
    </EmailLayout>
  );
};

// Styles (reused from WelcomeEmail for consistency)
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
