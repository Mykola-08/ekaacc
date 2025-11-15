'use server';

/**
 * @fileOverview A flow to generate a personalized monthly progress report for the user.
 * Simple implementation without external AI dependencies.
 */

import { generateMonthlyReportSummary } from '@/ai/ai-help-service';

export interface GenerateMonthlyReportInput {
  userId: string;
  startDate: string;
  endDate: string;
  healthHistory: string;
  reports: string;
  messages: string;
}

export interface GenerateMonthlyReportOutput {
  report: string;
  progress: string;
}

/**
 * Generate a personalized monthly progress report
 * This is a simplified implementation that creates helpful, encouraging reports
 * without requiring external AI services.
 */
export async function generateMonthlyReport(input: GenerateMonthlyReportInput): Promise<GenerateMonthlyReportOutput> {
  try {
    const { userId, startDate, endDate, healthHistory, reports, messages } = input;
    
    // Generate a supportive summary using our simple AI service
    const aiSummary = await generateMonthlyReportSummary(userId, new Date(startDate).getMonth(), new Date(startDate).getFullYear());
    
    // Create a comprehensive report based on the input data
    const report = generateDetailedReport(input, aiSummary);
    
    // Generate a one-sentence progress summary
    const progress = generateProgressSummary(input, aiSummary);
    
    return {
      report,
      progress
    };
  } catch (error) {
    console.error('Error generating monthly report:', error);
    
    // Fallback to a basic report
    return {
      report: generateFallbackReport(input),
      progress: "This month shows steady progress in your therapeutic journey."
    };
  }
}

/**
 * Generate a detailed monthly report
 */
function generateDetailedReport(input: GenerateMonthlyReportInput, aiSummary: string): string {
  const { startDate, endDate, healthHistory, reports, messages } = input;
  
  const monthName = new Date(startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  let report = `# Monthly Progress Report - ${monthName}\n\n`;
  
  // AI-generated summary
  report += `## Monthly Summary\n${aiSummary}\n\n`;
  
  // Health History Analysis
  if (healthHistory && healthHistory.trim()) {
    report += `## Health Insights\n`;
    report += analyzeHealthHistory(healthHistory);
    report += `\n\n`;
  }
  
  // Reports Analysis
  if (reports && reports.trim()) {
    report += `## Session Reports\n`;
    report += analyzeReports(reports);
    report += `\n\n`;
  }
  
  // Messages Analysis
  if (messages && messages.trim()) {
    report += `## Communication Summary\n`;
    report += analyzeMessages(messages);
    report += `\n\n`;
  }
  
  // Recommendations
  report += `## Recommendations for Next Month\n`;
  report += generateRecommendations(input);
  report += `\n\n`;
  
  // Encouragement
  report += `## Words of Encouragement\n`;
  report += getEncouragingMessage();
  
  return report;
}

/**
 * Generate a one-sentence progress summary
 */
function generateProgressSummary(input: GenerateMonthlyReportInput, aiSummary: string): string {
  // Extract key themes and create a concise summary
  const themes = extractThemes(input);
  
  if (themes.includes('improvement')) {
    return "This month shows significant improvement in your therapeutic journey with positive momentum building.";
  } else if (themes.includes('consistent')) {
    return "Your consistent engagement with therapy this month demonstrates strong commitment to personal growth.";
  } else if (themes.includes('challenging')) {
    return "Despite facing challenges this month, you've shown resilience and continued dedication to your mental health.";
  } else {
    return aiSummary.split('.')[0] + '.'; // Use first sentence of AI summary
  }
}

/**
 * Analyze health history data
 */
function analyzeHealthHistory(healthHistory: string): string {
  // Simple analysis based on keywords and patterns
  const positiveKeywords = ['improved', 'better', 'progress', 'good', 'positive', 'helpful'];
  const challengingKeywords = ['difficult', 'challenging', 'struggle', 'hard', 'tough'];
  
  const positiveCount = positiveKeywords.filter(keyword => 
    healthHistory.toLowerCase().includes(keyword)
  ).length;
  
  const challengingCount = challengingKeywords.filter(keyword => 
    healthHistory.toLowerCase().includes(keyword)
  ).length;
  
  if (positiveCount > challengingCount) {
    return "Your health history this month shows predominantly positive trends, with improvements in key areas. This indicates that your therapeutic efforts are yielding beneficial results.";
  } else if (challengingCount > positiveCount) {
    return "Your health history reveals some challenges this month, but remember that setbacks are a normal part of the healing process. These experiences provide valuable insights for continued growth.";
  } else {
    return "Your health history shows a balanced mix of experiences this month. Both positive developments and challenges contribute to your overall therapeutic journey.";
  }
}

/**
 * Analyze reports data
 */
function analyzeReports(reports: string): string {
  // Simple analysis of session reports
  const sessionCount = (reports.match(/session/gi) || []).length;
  const progressCount = (reports.match(/progress/gi) || []).length;
  
  if (sessionCount > 0) {
    return `This month included ${sessionCount} therapy session${sessionCount > 1 ? 's' : ''}. ${progressCount > 0 ? `Your reports indicate ${progressCount} instance${progressCount > 1 ? 's' : ''} of noted progress.` : 'Each session contributes to your therapeutic progress.'} Regular attendance and engagement are key factors in successful therapy outcomes.`;
  } else {
    return "Session reports for this month are limited, but your continued participation in therapy is valuable for your mental health journey.";
  }
}

/**
 * Analyze messages data
 */
function analyzeMessages(messages: string): string {
  // Simple analysis of communication
  const messageCount = messages.split('\n').filter(line => line.trim()).length;
  const positiveTone = (messages.match(/thank|appreciate|good|helpful|great/gi) || []).length;
  
  if (messageCount > 0) {
    return `Communication records show ${messageCount} meaningful interaction${messageCount > 1 ? 's' : ''} this month. ${positiveTone > 0 ? 'The tone of communications was generally positive, indicating good therapeutic rapport.' : 'Your active communication helps build a strong therapeutic relationship.'}`;
  } else {
    return "Communication this month was limited, but maintaining open dialogue with your therapist supports better therapeutic outcomes.";
  }
}

/**
 * Generate recommendations
 */
function generateRecommendations(input: GenerateMonthlyReportInput): string {
  const recommendations = [
    "Continue attending therapy sessions regularly to maintain momentum in your therapeutic journey.",
    "Practice self-care activities that support your mental health between sessions.",
    "Consider journaling your thoughts and feelings to track patterns and progress.",
    "Stay connected with your support network of friends and family.",
    "Be patient with yourself - healing takes time and everyone's journey is unique."
  ];
  
  // Select 3 random recommendations
  const selectedRecommendations = recommendations
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  return selectedRecommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n');
}

/**
 * Extract themes from input data
 */
function extractThemes(input: GenerateMonthlyReportInput): string[] {
  const themes: string[] = [];
  const allText = `${input.healthHistory} ${input.reports} ${input.messages}`.toLowerCase();
  
  if (allText.includes('improve') || allText.includes('better') || allText.includes('progress')) {
    themes.push('improvement');
  }
  
  if (allText.includes('consistent') || allText.includes('regular') || allText.includes('continue')) {
    themes.push('consistent');
  }
  
  if (allText.includes('difficult') || allText.includes('challenge') || allText.includes('struggle')) {
    themes.push('challenging');
  }
  
  if (allText.includes('good') || allText.includes('positive') || allText.includes('helpful')) {
    themes.push('positive');
  }
  
  return themes;
}

/**
 * Get encouraging message
 */
function getEncouragingMessage(): string {
  const messages = [
    "Remember, every step forward in your therapeutic journey is meaningful. Your commitment to personal growth is admirable and will continue to yield positive results.",
    "Healing is not linear, and that's perfectly normal. The fact that you're actively engaged in therapy shows tremendous strength and self-awareness.",
    "You are doing important work by prioritizing your mental health. Continue being patient and compassionate with yourself as you navigate this journey.",
    "Your therapeutic progress is like planting seeds - some grow quickly, others take time, but all contribute to your overall well-being and resilience."
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Generate fallback report when AI service fails
 */
function generateFallbackReport(input: GenerateMonthlyReportInput): string {
  const { startDate, endDate } = input;
  const monthName = new Date(startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `# Monthly Progress Report - ${monthName}

## Monthly Summary
This month represents another important step in your therapeutic journey. Your continued engagement with the therapy process demonstrates commitment to personal growth and mental health.

## Health Insights
Your health data this month reflects the natural ebb and flow of the healing process. Both positive developments and challenges contribute to your overall therapeutic progress.

## Session Reports
Regular participation in therapy sessions continues to support your mental health goals. Each session builds upon previous work to create lasting positive change.

## Communication Summary
Your interactions with the therapeutic team help build a strong foundation for effective treatment. Open communication supports better therapeutic outcomes.

## Recommendations for Next Month
1. Continue attending therapy sessions regularly
2. Practice self-care activities between sessions
3. Maintain open communication with your therapist
4. Be patient with your healing process

## Words of Encouragement
Remember that healing takes time and everyone's journey is unique. Your commitment to personal growth is admirable and will continue to yield positive results.`;
}
