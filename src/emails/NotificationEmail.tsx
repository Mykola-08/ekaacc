import * as React from 'react';
import {
  Button,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface NotificationEmailProps {
  userName?: string;
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
  unsubscribeUrl?: string;
}

export const NotificationEmail = ({
  userName,
  title,
  message,
  actionLabel,
  actionUrl,
  unsubscribeUrl,
}: NotificationEmailProps) => {
  return (
    <EmailLayout preview={title} unsubscribeUrl={unsubscribeUrl}>
      <Heading style={h1}>{title}</Heading>
      <Text style={text}>
        Hi {userName || 'there'},
      </Text>
      <Text style={text}>
        {message}
      </Text>
      
      {actionLabel && actionUrl && (
        <Section style={btnContainer}>
          <Button style={button} href={actionUrl}>
            {actionLabel}
          </Button>
        </Section>
      )}
    </EmailLayout>
  );
};

export default NotificationEmail;

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

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '28px',
  marginBottom: '28px',
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
