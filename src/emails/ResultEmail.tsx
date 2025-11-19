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

interface ResultItem {
  label: string;
  value: string | number;
  status?: 'success' | 'warning' | 'error' | 'neutral';
}

interface ResultEmailProps {
  userName?: string;
  title: string;
  summary: string;
  results: ResultItem[];
  actionLabel?: string;
  actionUrl?: string;
  unsubscribeUrl?: string;
}

export const ResultEmail = ({
  userName,
  title,
  summary,
  results = [],
  actionLabel = 'View Full Report',
  actionUrl,
  unsubscribeUrl,
}: ResultEmailProps) => {
  return (
    <EmailLayout preview={title} unsubscribeUrl={unsubscribeUrl}>
      <Heading style={h1}>📊 {title}</Heading>
      <Text style={text}>
        Hi {userName || 'there'},
      </Text>
      <Text style={text}>
        {summary}
      </Text>
      
      <Section style={resultsContainer}>
        {results.map((item, index) => (
          <Row key={index} style={resultRow}>
            <Column>
              <Text style={resultLabel}>{item.label}</Text>
            </Column>
            <Column style={{ textAlign: 'right' }}>
              <Text style={{...resultValue, color: getStatusColor(item.status)}}>{item.value}</Text>
            </Column>
          </Row>
        ))}
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

const getStatusColor = (status?: string) => {
    switch(status) {
        case 'success': return '#16a34a';
        case 'warning': return '#ca8a04';
        case 'error': return '#dc2626';
        default: return '#1a1a1a';
    }
}

export default ResultEmail;

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

const resultsContainer = {
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  overflow: 'hidden',
  marginBottom: '24px',
};

const resultRow = {
  borderBottom: '1px solid #e5e7eb',
  padding: '12px 16px',
};

const resultLabel = {
  color: '#4b5563',
  fontSize: '16px',
  margin: 0,
};

const resultValue = {
  fontSize: '16px',
  fontWeight: '600',
  margin: 0,
};

const btnContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};
