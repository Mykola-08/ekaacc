import * as React from 'react';
import {
  Button,
  Heading,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface ReminderEmailProps {
  userName?: string;
  reminderTitle: string;
  reminderDetails: string;
  date?: string;
  time?: string;
  location?: string;
  actionLabel?: string;
  actionUrl?: string;
  unsubscribeUrl?: string;
}

export const ReminderEmail = ({
  userName,
  reminderTitle,
  reminderDetails,
  date,
  time,
  location,
  actionLabel = 'View Details',
  actionUrl,
  unsubscribeUrl,
}: ReminderEmailProps) => {
  return (
    <EmailLayout preview={`Reminder: ${reminderTitle}`} unsubscribeUrl={unsubscribeUrl}>
      <Heading style={h1}>🔔 {reminderTitle}</Heading>
      <Text style={text}>
        Hi {userName || 'there'},
      </Text>
      <Text style={text}>
        This is a friendly reminder about the following:
      </Text>
      
      <Section style={card}>
        <Text style={detailsText}>{reminderDetails}</Text>
        
        {(date || time) && (
            <Section style={dateTimeContainer}>
                {date && <Text style={metaText}>📅 {date}</Text>}
                {time && <Text style={metaText}>⏰ {time}</Text>}
            </Section>
        )}
        
        {location && (
            <Text style={metaText}>📍 {location}</Text>
        )}
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

export default ReminderEmail;

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

const card = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
};

const detailsText = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '500',
  marginBottom: '16px',
};

const dateTimeContainer = {
  marginBottom: '8px',
};

const metaText = {
  color: '#4b5563',
  fontSize: '16px',
  margin: '4px 0',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};
