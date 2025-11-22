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

const card = {
  backgroundColor: '#F9FAFB',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
  padding: '20px',
  marginBottom: '24px',
};

const detailsText = {
  color: '#1F2937',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '16px',
  fontWeight: '500',
};

const dateTimeContainer = {
  marginTop: '12px',
  marginBottom: '12px',
};

const metaText = {
  color: '#6B7280',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '4px 0',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '24px',
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

// Duplicate style block removed (retained initial definitions)
