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
      <Heading style={h1}>{title}</Heading>
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
        case 'success': return '#10B981';
        case 'warning': return '#F59E0B';
        case 'error': return '#EF4444';
        default: return '#1F2937';
    }
}

export default ResultEmail;

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

const resultsContainer = {
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  overflow: 'hidden',
  marginTop: '24px',
  marginBottom: '24px',
};

const resultRow = {
  borderBottom: '1px solid #F3F4F6',
  padding: '16px',
};

const resultLabel = {
  color: '#6B7280',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const resultValue = {
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '28px',
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
