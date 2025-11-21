import * as React from 'react';
import { Text, Heading, Markdown } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

interface BroadcastEmailProps {
  subject: string;
  content: string; // Markdown content
  userName?: string;
  unsubscribeUrl?: string;
}

export const BroadcastEmail = ({ subject, content, userName, unsubscribeUrl }: BroadcastEmailProps) => {
  return (
    <EmailLayout preview={subject} unsubscribeUrl={unsubscribeUrl}>
      <Heading style={h1}>{subject}</Heading>
      {userName && (
        <Text style={text}>
          Hi {userName},
        </Text>
      )}
      <Markdown
        markdownCustomStyles={{
          h1: { ...h1, fontSize: '20px' },
          h2: { ...h1, fontSize: '18px' },
          p: text,
          li: text,
        }}
      >
        {content}
      </Markdown>
    </EmailLayout>
  );
};

const h1 = {
  color: '#1F2937',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 24px',
  letterSpacing: '-0.02em',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 20px',
};

export default BroadcastEmail;
