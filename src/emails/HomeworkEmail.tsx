import * as React from 'react';
import {
  Button,
  Heading,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface HomeworkEmailProps {
  userName?: string;
  therapistName: string;
  assignmentTitle: string;
  description: string;
  dueDate?: string;
  actionLabel?: string;
  actionUrl?: string;
  unsubscribeUrl?: string;
}

export const HomeworkEmail = ({
  userName,
  therapistName,
  assignmentTitle,
  description,
  dueDate,
  actionLabel = 'View Assignment',
  actionUrl,
  unsubscribeUrl,
}: HomeworkEmailProps) => {
  return (
    <EmailLayout preview={`New Assignment: ${assignmentTitle}`} unsubscribeUrl={unsubscribeUrl}>
      <Heading style={h1}>📚 New Homework Assignment</Heading>
      <Text style={text}>
        Hi {userName || 'there'},
      </Text>
      <Text style={text}>
        {therapistName} has assigned you a new task to help with your progress.
      </Text>
      
      <Section style={card}>
        <Text style={titleText}>{assignmentTitle}</Text>
        <Text style={text}>{description}</Text>
        {dueDate && (
            <Text style={metaText}><strong>Due Date:</strong> {dueDate}</Text>
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

export default HomeworkEmail;

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
  backgroundColor: '#F0F5FF',
  border: '2px solid #BAE6FD',
  borderRadius: '10px',
  padding: '24px',
  marginBottom: '24px',
};

const titleText = {
  color: '#4F7CFF',
  fontSize: '20px',
  fontWeight: '700',
  marginBottom: '12px',
};

const metaText = {
  color: '#6B7280',
  fontSize: '14px',
  marginTop: '12px',
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
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#0284c7',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};
