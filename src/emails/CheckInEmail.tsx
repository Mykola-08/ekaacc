import * as React from 'react';
import {
  Button,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface CheckInEmailProps {
  userName?: string;
  therapistName: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
  unsubscribeUrl?: string;
}

export const CheckInEmail = ({
  userName,
  therapistName,
  message,
  actionLabel = 'Reply Now',
  actionUrl,
  unsubscribeUrl,
}: CheckInEmailProps) => {
  return (
    <EmailLayout preview={`Check-in from ${therapistName}`} unsubscribeUrl={unsubscribeUrl}>
      <Heading style={h1}>👋 Just Checking In</Heading>
      <Text style={text}>
        Hi {userName || 'there'},
      </Text>
      <Text style={text}>
        {therapistName} wanted to check in with you:
      </Text>
      
      <Section style={messageBox}>
        <Text style={messageText}>"{message}"</Text>
      </Section>

      {actionUrl && (
        <Section style={btnContainer}>
          <Button style={button} href={actionUrl}>
            {actionLabel}
          </Button>
        </Section>
      )}
    </EmailLayout>
  );
};

export default CheckInEmail;

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

const messageBox = {
  borderLeft: '4px solid #8b5cf6',
  backgroundColor: '#f5f3ff',
  padding: '16px 24px',
  marginBottom: '24px',
  fontStyle: 'italic',
};

const messageText = {
  color: '#4c1d95',
  fontSize: '18px',
  lineHeight: '1.6',
  margin: 0,
};

const btnContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#7c3aed',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};
