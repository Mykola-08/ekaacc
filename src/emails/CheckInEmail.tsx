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
  color: '#1F2937',
  fontSize: '26px',
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

const messageBox = {
  borderLeft: '4px solid #4F7CFF',
  backgroundColor: '#F0F5FF',
  padding: '20px 24px',
  marginBottom: '24px',
  borderRadius: '4px',
};

const messageText = {
  color: '#1F2937',
  fontSize: '18px',
  lineHeight: '1.6',
  margin: 0,
  fontStyle: 'italic',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
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
