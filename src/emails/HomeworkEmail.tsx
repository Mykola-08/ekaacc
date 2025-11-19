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
  backgroundColor: '#f0f9ff',
  border: '1px solid #bae6fd',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
};

const titleText = {
  color: '#0369a1',
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '12px',
};

const metaText = {
  color: '#4b5563',
  fontSize: '14px',
  marginTop: '12px',
};

const btnContainer = {
  textAlign: 'center' as const,
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
