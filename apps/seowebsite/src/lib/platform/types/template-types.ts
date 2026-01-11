import { User, Session } from '@/lib/platform/types/types';

export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface TherapistTemplate {
  id: string;
  name: string;
  category: 'progress' | 'assessment' | 'treatment-plan' | 'session-notes' | 'discharge';
  description: string;
  content: string;
  fields: TemplateField[];
  createdAt: string;
  updatedAt: string;
  useCount: number;
}

export interface AutofillData {
  clientName: string;
  therapistName: string;
  sessionDate: string;
  sessionType: string;
  sessionNumber: number;
  totalSessions: number;
  diagnosisCodes?: string[];
  treatmentGoals?: string[];
  progressNotes?: string;
  clientAge?: number;
  clientGender?: string;
  nextSessionDate?: string;
}

export const DEFAULT_TEMPLATES: Omit<TherapistTemplate, 'id' | 'createdAt' | 'updatedAt' | 'useCount'>[] = [
  {
    name: 'Initial Assessment Report',
    category: 'assessment',
    description: 'Comprehensive initial client assessment documentation',
    content: `INITIAL ASSESSMENT REPORT

CLIENT INFORMATION
Name: {{clientName}}
Age: {{clientAge}}
Gender: {{clientGender}}
Date of Assessment: {{sessionDate}}
Therapist: {{therapistName}}

PRESENTING CONCERNS
{{presentingConcerns}}

CLINICAL OBSERVATIONS
Appearance: {{appearance}}
Mood: {{mood}}
Affect: {{affect}}
Speech: {{speech}}
Thought Process: {{thoughtProcess}}

DIAGNOSTIC IMPRESSIONS
{{diagnosticImpressions}}
Diagnosis Codes: {{diagnosisCodes}}

TREATMENT RECOMMENDATIONS
{{treatmentRecommendations}}

GOALS
{{treatmentGoals}}

PROGNOSIS
{{prognosis}}

Next Session: {{nextSessionDate}}

Therapist Signature: {{therapistName}}
Date: {{sessionDate}}`,
    fields: [
      { key: 'presentingConcerns', label: 'Presenting Concerns', type: 'textarea', required: true },
      { key: 'appearance', label: 'Appearance', type: 'text', placeholder: 'Well-groomed, appropriate dress' },
      { key: 'mood', label: 'Mood', type: 'select', options: ['Euthymic', 'Depressed', 'Anxious', 'Irritable', 'Elevated'], required: true },
      { key: 'affect', label: 'Affect', type: 'select', options: ['Appropriate', 'Flat', 'Restricted', 'Labile', 'Expansive'], required: true },
      { key: 'speech', label: 'Speech', type: 'text', placeholder: 'Normal rate and tone' },
      { key: 'thoughtProcess', label: 'Thought Process', type: 'text', placeholder: 'Linear and goal-directed' },
      { key: 'diagnosticImpressions', label: 'Diagnostic Impressions', type: 'textarea', required: true },
      { key: 'treatmentRecommendations', label: 'Treatment Recommendations', type: 'textarea', required: true },
      { key: 'prognosis', label: 'Prognosis', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Guarded', 'Poor'] },
    ],
  },
  {
    name: 'Progress Note',
    category: 'progress',
    description: 'Standard session progress documentation',
    content: `PROGRESS NOTE

CLIENT: {{clientName}}
SESSION DATE: {{sessionDate}}
SESSION #: {{sessionNumber}} of {{totalSessions}}
THERAPIST: {{therapistName}}
SESSION TYPE: {{sessionType}}

SUBJECTIVE
{{subjective}}

OBJECTIVE
Mood: {{mood}}
Engagement: {{engagement}}
Progress: {{progress}}

ASSESSMENT
{{assessment}}

PLAN
{{plan}}

Next Session: {{nextSessionDate}}

Therapist: {{therapistName}}`,
    fields: [
      { key: 'subjective', label: 'Subjective (Client Report)', type: 'textarea', required: true, placeholder: 'How the client describes their week, symptoms, progress...' },
      { key: 'mood', label: 'Observed Mood', type: 'select', options: ['Improved', 'Stable', 'Declining', 'Variable'], required: true },
      { key: 'engagement', label: 'Engagement Level', type: 'select', options: ['Highly engaged', 'Engaged', 'Moderately engaged', 'Minimally engaged', 'Disengaged'], required: true },
      { key: 'progress', label: 'Progress on Goals', type: 'select', options: ['Significant progress', 'Moderate progress', 'Minimal progress', 'No progress', 'Regression'], required: true },
      { key: 'assessment', label: 'Assessment & Analysis', type: 'textarea', required: true, placeholder: 'Your professional assessment of the session and client progress' },
      { key: 'plan', label: 'Plan for Next Session', type: 'textarea', required: true, placeholder: 'Homework, techniques to practice, focus areas...' },
    ],
  },
  {
    name: 'Treatment Plan',
    category: 'treatment-plan',
    description: 'Comprehensive treatment planning document',
    content: `TREATMENT PLAN

CLIENT NAME: {{clientName}}
THERAPIST: {{therapistName}}
DATE CREATED: {{sessionDate}}
REVIEW DATE: {{nextSessionDate}}

PRIMARY DIAGNOSIS
{{diagnosisCodes}}

PRESENTING PROBLEMS
{{presentingProblems}}

TREATMENT GOALS
{{treatmentGoals}}

GOAL 1: {{goal1}}
Objectives:
{{goal1Objectives}}
Interventions:
{{goal1Interventions}}
Target Date: {{goal1TargetDate}}

GOAL 2: {{goal2}}
Objectives:
{{goal2Objectives}}
Interventions:
{{goal2Interventions}}
Target Date: {{goal2TargetDate}}

GOAL 3: {{goal3}}
Objectives:
{{goal3Objectives}}
Interventions:
{{goal3Interventions}}
Target Date: {{goal3TargetDate}}

TREATMENT MODALITIES
{{treatmentModalities}}

SESSION FREQUENCY
{{sessionFrequency}}

ESTIMATED DURATION
{{estimatedDuration}}

CLIENT SIGNATURE: ___________________ DATE: _______
THERAPIST SIGNATURE: {{therapistName}} DATE: {{sessionDate}}`,
    fields: [
      { key: 'presentingProblems', label: 'Presenting Problems', type: 'textarea', required: true },
      { key: 'goal1', label: 'Primary Goal', type: 'text', required: true },
      { key: 'goal1Objectives', label: 'Goal 1 Objectives', type: 'textarea', required: true },
      { key: 'goal1Interventions', label: 'Goal 1 Interventions', type: 'textarea', required: true },
      { key: 'goal1TargetDate', label: 'Goal 1 Target Date', type: 'date' },
      { key: 'goal2', label: 'Secondary Goal', type: 'text' },
      { key: 'goal2Objectives', label: 'Goal 2 Objectives', type: 'textarea' },
      { key: 'goal2Interventions', label: 'Goal 2 Interventions', type: 'textarea' },
      { key: 'goal2TargetDate', label: 'Goal 2 Target Date', type: 'date' },
      { key: 'goal3', label: 'Tertiary Goal', type: 'text' },
      { key: 'goal3Objectives', label: 'Goal 3 Objectives', type: 'textarea' },
      { key: 'goal3Interventions', label: 'Goal 3 Interventions', type: 'textarea' },
      { key: 'goal3TargetDate', label: 'Goal 3 Target Date', type: 'date' },
      { key: 'treatmentModalities', label: 'Treatment Modalities', type: 'textarea', placeholder: 'CBT, DBT, EMDR, etc.', required: true },
      { key: 'sessionFrequency', label: 'Session Frequency', type: 'select', options: ['Weekly', 'Bi-weekly', 'Monthly', 'As needed'], required: true },
      { key: 'estimatedDuration', label: 'Estimated Duration', type: 'select', options: ['6 weeks', '3 months', '6 months', '1 year', 'Ongoing'], required: true },
    ],
  },
  {
    name: 'Session Notes (SOAP Format)',
    category: 'session-notes',
    description: 'Structured SOAP format session documentation',
    content: `SESSION NOTES (SOAP FORMAT)

Date: {{sessionDate}}
Client: {{clientName}}
Session: {{sessionNumber}} of {{totalSessions}}
Therapist: {{therapistName}}
Duration: 50 minutes

S - SUBJECTIVE
{{subjective}}

O - OBJECTIVE
Appearance: {{appearance}}
Behavior: {{behavior}}
Mood: {{mood}}
Affect: {{affect}}

A - ASSESSMENT
{{assessment}}
Progress on treatment goals: {{progressAssessment}}
Risk assessment: {{riskAssessment}}

P - PLAN
{{plan}}
Homework: {{homework}}
Next session: {{nextSessionDate}}

Therapist: {{therapistName}}`,
    fields: [
      { key: 'subjective', label: 'Subjective', type: 'textarea', required: true, placeholder: 'Client\'s reported symptoms, experiences, concerns' },
      { key: 'appearance', label: 'Appearance', type: 'text', placeholder: 'Grooming, dress, hygiene' },
      { key: 'behavior', label: 'Behavior', type: 'text', placeholder: 'Eye contact, body language, cooperation' },
      { key: 'mood', label: 'Mood', type: 'text', required: true, placeholder: 'Client\'s reported emotional state' },
      { key: 'affect', label: 'Affect', type: 'text', required: true, placeholder: 'Observed emotional expression' },
      { key: 'assessment', label: 'Assessment', type: 'textarea', required: true, placeholder: 'Clinical impressions, symptom severity, functioning' },
      { key: 'progressAssessment', label: 'Progress on Goals', type: 'textarea', required: true },
      { key: 'riskAssessment', label: 'Risk Assessment', type: 'select', options: ['No risk identified', 'Low risk', 'Moderate risk', 'High risk - safety plan in place'], required: true },
      { key: 'plan', label: 'Plan', type: 'textarea', required: true, placeholder: 'Interventions used, focus for next session' },
      { key: 'homework', label: 'Homework Assigned', type: 'textarea', placeholder: 'Specific tasks or exercises' },
    ],
  },
  {
    name: 'Discharge Summary',
    category: 'discharge',
    description: 'Client discharge and treatment summary',
    content: `DISCHARGE SUMMARY

CLIENT INFORMATION
Name: {{clientName}}
Date of Discharge: {{sessionDate}}
Therapist: {{therapistName}}
Total Sessions: {{totalSessions}}
Treatment Duration: {{treatmentDuration}}

REASON FOR DISCHARGE
{{dischargeReason}}

TREATMENT SUMMARY
Initial Presentation: {{initialPresentation}}
Diagnosis: {{diagnosisCodes}}
Treatment Provided: {{treatmentProvided}}

PROGRESS ACHIEVED
{{progressAchieved}}

Goals Met:
{{goalsMet}}

Goals Partially Met:
{{goalsPartiallyMet}}

CURRENT STATUS
{{currentStatus}}

DISCHARGE RECOMMENDATIONS
{{dischargeRecommendations}}

FOLLOW-UP PLAN
{{followUpPlan}}

PROGNOSIS
{{prognosis}}

Final Risk Assessment: {{finalRiskAssessment}}

Therapist Signature: {{therapistName}}
Date: {{sessionDate}}`,
    fields: [
      { key: 'dischargeReason', label: 'Reason for Discharge', type: 'select', options: ['Goals achieved', 'Client request', 'Treatment completed', 'Client no-show', 'Referral to higher level of care', 'Client relocated', 'Insurance/financial'], required: true },
      { key: 'treatmentDuration', label: 'Treatment Duration', type: 'text', placeholder: 'e.g., 6 months' },
      { key: 'initialPresentation', label: 'Initial Presentation', type: 'textarea', required: true },
      { key: 'treatmentProvided', label: 'Treatment Provided', type: 'textarea', required: true, placeholder: 'Modalities, techniques, frequency' },
      { key: 'progressAchieved', label: 'Overall Progress Achieved', type: 'textarea', required: true },
      { key: 'goalsMet', label: 'Goals Met', type: 'textarea' },
      { key: 'goalsPartiallyMet', label: 'Goals Partially Met', type: 'textarea' },
      { key: 'currentStatus', label: 'Current Status', type: 'textarea', required: true, placeholder: 'Symptom status, functioning, coping skills' },
      { key: 'dischargeRecommendations', label: 'Discharge Recommendations', type: 'textarea', required: true, placeholder: 'Continued care, self-care strategies, resources' },
      { key: 'followUpPlan', label: 'Follow-up Plan', type: 'textarea', placeholder: 'Check-in schedule, booster sessions, etc.' },
      { key: 'prognosis', label: 'Prognosis', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Guarded'], required: true },
      { key: 'finalRiskAssessment', label: 'Final Risk Assessment', type: 'select', options: ['No risk', 'Low risk', 'Moderate risk'], required: true },
    ],
  },
];
