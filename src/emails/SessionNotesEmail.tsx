import * as React from 'react';
import {
  Button,
  Heading,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface SessionNotesEmailProps {
  userName?: string;
  therapistName: string;
  sessionDate: string;
  summary: string;
  keyTakeaways?: string[];
  nextSessionDate?: string;
  unsubscribeUrl?: string;
}

export const SessionNotesEmail = ({
  userName,
  therapistName,
  sessionDate,
  summary,
  keyTakeaways = [],
  nextSessionDate,
  unsubscribeUrl,
}: SessionNotesEmailProps) => {
  return (
    <EmailLayout preview={`Notes from your session on ${sessionDate}`} unsubscribeUrl={unsubscribeUrl}>
      <Heading style={h1}>📝 Session Notes</Heading>
      <Text style={text}>
        Hi {userName || 'there'},
      </Text>
      <Text style={text}>
        Here is a summary of your session with {therapistName} on {sessionDate}.
      </Text>
      
      <Section style={section}>
        <Heading as="h3" style={h3}>Summary</Heading>
        <Text style={text}>{summary}</Text>
      </Section>

      {keyTakeaways.length > 0 && (
        <Section style={section}>
            <Heading as="h3" style={h3}>Key Takeaways</Heading>
            <ul style={list}>
                {keyTakeaways.map((item, index) => (
                    <li key={index} style={listItem}>{item}</li>
                ))}
            </ul>
        </Section>
      )}

      {nextSessionDate && (
        <Section style={highlightBox}>
            <Text style={highlightText}>
                <strong>Next Session:</strong> {nextSessionDate}
            </Text>
        </Section>
      )}
    </EmailLayout>
  );
};

export default SessionNotesEmail;

const h1 = {
  color: '#1F2937',
  fontSize: '26px',
  fontWeight: '700',
  lineHeight: '1.3',
  marginBottom: '20px',
  letterSpacing: '-0.02em',
};

const h3 = {
  color: '#1F2937',
  fontSize: '18px',
  fontWeight: '700',
  marginBottom: '12px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '16px',
};

const section = {
  marginBottom: '28px',
};

const list = {
  paddingLeft: '20px',
  marginBottom: '20px',
};

const listItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '8px',
};

const highlightBox = {
  backgroundColor: '#F0F5FF',
  border: '2px solid #4F7CFF',
  borderRadius: '8px',
  padding: '16px 20px',
  marginTop: '24px',
};

const highlightText = {
  color: '#1F2937',
  fontSize: '16px',
  margin: '0',
};
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '8px',
};

const highlightBox = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '16px',
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const highlightText = {
  color: '#1a1a1a',
  fontSize: '16px',
  margin: 0,
};
