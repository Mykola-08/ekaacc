import { AIPersonalizationService } from './ai-personalization-service';
import { AISDKNextService } from './ai-sdk-next-service';

interface DonationApplication {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  financialSituation: string;
  monthlyIncome: number;
  householdSize: number;
  employmentStatus: string;
  reasonForApplication: string;
  supportingDocuments: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  aiAnalysis?: AIApplicationAnalysis;
}

interface AIApplicationAnalysis {
  needScore: number; // 0-100
  confidence: number; // 0-100
  riskFactors: string[];
  recommendation: 'approve' | 'reject' | 'review_further';
  explanation: string;
  fraudIndicators: FraudIndicator[];
  financialAssessment: FinancialAssessment;
  urgencyAssessment: UrgencyAssessment;
  behavioralAnalysis: BehavioralAnalysis;
}

interface FraudIndicator {
  type: 'duplicate_application' | 'suspicious_income' | 'inconsistent_information' | 'fake_documents' | 'multiple_accounts';
  severity: 'low' | 'medium' | 'high';
  description: string;
  evidence: string[];
}

interface FinancialAssessment {
  incomeToPovertyRatio: number;
  monthlyIncomePerCapita: number;
  financialStressIndicators: string[];
  affordabilityScore: number; // 0-100
}

interface UrgencyAssessment {
  urgencyScore: number; // 0-100
  keyFactors: string[];
  timelineRisk: 'immediate' | 'short_term' | 'medium_term' | 'low';
  supportingEvidence: string[];
}

interface BehavioralAnalysis {
  applicationPattern: 'normal' | 'rushed' | 'suspicious' | 'desperate';
  languageAnalysis: {
    sentiment: 'positive' | 'neutral' | 'negative';
    emotionalIndicators: string[];
    authenticityScore: number; // 0-100
  };
  riskBehaviors: string[];
}

interface VerificationRequest {
  applicationId: string;
  userId: string;
  verificationLevel: 'basic' | 'comprehensive' | 'enhanced';
  includeFraudCheck: boolean;
  includeFinancialAnalysis: boolean;
  includeBehavioralAnalysis: boolean;
  context: {
    previousApplications: DonationApplication[];
    userHistory: UserHistory;
    systemWideStats: SystemStats;
  };
}

interface UserHistory {
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  averageNeedScore: number;
  applicationTimeline: Array<{
    date: Date;
    status: string;
    needScore: number;
  }>;
  riskProfile: 'low' | 'medium' | 'high';
}

interface SystemStats {
  totalApplications: number;
  approvalRate: number;
  averageNeedScore: number;
  fraudDetectionRate: number;
  monthlyApplications: number;
}

interface VerificationResult {
  applicationId: string;
  userId: string;
  analysis: AIApplicationAnalysis;
  recommendation: VerificationRecommendation;
  confidence: number;
  processingTime: number;
  reviewedAt: Date;
}

interface VerificationRecommendation {
  action: 'approve' | 'reject' | 'review_manual' | 'request_more_info';
  priority: 'immediate' | 'high' | 'medium' | 'low';
  reasoning: string;
  conditions?: string[];
  humanReviewRequired: boolean;
}

export class AIVerificationSystem {
  private personalizationService: AIPersonalizationService;
  private aiService: AISDKNextService;
  private fraudPatterns: Map<string, any>;
  private verificationHistory: Map<string, VerificationResult[]>;

  constructor() {
    this.personalizationService = new AIPersonalizationService();
    this.aiService = AISDKNextService.getInstance();
    this.fraudPatterns = new Map();
    this.verificationHistory = new Map();
    this.initializeFraudPatterns();
  }

  private initializeFraudPatterns(): void {
    // Common fraud patterns to detect
    this.fraudPatterns.set('duplicate_applications', {
      check: this.checkDuplicateApplications.bind(this),
      weight: 0.3
    });
    
    this.fraudPatterns.set('suspicious_income', {
      check: this.checkSuspiciousIncome.bind(this),
      weight: 0.25
    });
    
    this.fraudPatterns.set('inconsistent_information', {
      check: this.checkInconsistentInformation.bind(this),
      weight: 0.2
    });
    
    this.fraudPatterns.set('fake_documents', {
      check: this.checkFakeDocuments.bind(this),
      weight: 0.15
    });
    
    this.fraudPatterns.set('multiple_accounts', {
      check: this.checkMultipleAccounts.bind(this),
      weight: 0.1
    });
  }

  async verifyApplication(request: VerificationRequest): Promise<VerificationResult> {
    const startTime = Date.now();
    
    try {
      // Get user profile for additional context
      const userProfile = await this.personalizationService.getPersonalizationProfile(request.userId);
      
      // Perform comprehensive analysis
      const analysis = await this.performComprehensiveAnalysis(request, userProfile);
      
      // Generate recommendation based on analysis
      const recommendation = this.generateRecommendation(analysis, request);
      
      const result: VerificationResult = {
        applicationId: request.applicationId,
        userId: request.userId,
        analysis,
        recommendation,
        confidence: analysis.confidence,
        processingTime: Date.now() - startTime,
        reviewedAt: new Date()
      };

      // Store result in history
      this.storeVerificationResult(request.userId, result);
      
      return result;
    } catch (error) {
      console.error('Error verifying application:', error);
      throw new Error('Verification failed');
    }
  }

  private async performComprehensiveAnalysis(
    request: VerificationRequest, 
    userProfile: any
  ): Promise<AIApplicationAnalysis> {
    const application = request.context.previousApplications.find(a => a.id === request.applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    const analysis: Partial<AIApplicationAnalysis> = {};

    // Financial assessment
    if (request.includeFinancialAnalysis) {
      analysis.financialAssessment = await this.assessFinancialSituation(application);
    }

    // Fraud detection
    if (request.includeFraudCheck) {
      analysis.fraudIndicators = await this.detectFraudIndicators(application, request.context);
    }

    // Behavioral analysis
    if (request.includeBehavioralAnalysis) {
      analysis.behavioralAnalysis = await this.analyzeApplicationBehavior(application);
    }

    // Urgency assessment
    analysis.urgencyAssessment = await this.assessUrgency(application);

    // Calculate overall need score
    analysis.needScore = this.calculateNeedScore(analysis, request);
    
    // Calculate confidence
    analysis.confidence = this.calculateConfidence(analysis, request.verificationLevel);

    // Generate recommendation and explanation
    analysis.recommendation = this.generateAnalysisRecommendation(analysis);
    analysis.explanation = this.generateAnalysisExplanation(analysis);

    return analysis as AIApplicationAnalysis;
  }

  private async assessFinancialSituation(application: DonationApplication): Promise<FinancialAssessment> {
    const povertyThreshold2024 = 14880; // Single person annual poverty threshold
    const householdAdjustment = application.householdSize > 1 ? (application.householdSize - 1) * 5440 : 0;
    const annualPovertyThreshold = povertyThreshold2024 + householdAdjustment;
    const monthlyPovertyThreshold = annualPovertyThreshold / 12;

    const incomeToPovertyRatio = (application.monthlyIncome / monthlyPovertyThreshold) * 100;
    const monthlyIncomePerCapita = application.monthlyIncome / application.householdSize;

    const financialStressIndicators: string[] = [];
    
    if (incomeToPovertyRatio < 100) {
      financialStressIndicators.push('Income below poverty threshold');
    }
    
    if (monthlyIncomePerCapita < 1000) {
      financialStressIndicators.push('Very low per-capita income');
    }

    if (application.employmentStatus === 'unemployed') {
      financialStressIndicators.push('Currently unemployed');
    }

    if (application.employmentStatus === 'part-time') {
      financialStressIndicators.push('Limited employment hours');
    }

    // Calculate affordability score (0-100, higher = less affordable)
    const affordabilityScore = Math.min(100, Math.max(0, 
      (monthlyPovertyThreshold / Math.max(application.monthlyIncome, 1)) * 100
    ));

    return {
      incomeToPovertyRatio,
      monthlyIncomePerCapita,
      financialStressIndicators,
      affordabilityScore
    };
  }

  private async detectFraudIndicators(
    application: DonationApplication, 
    context: VerificationRequest['context']
  ): Promise<FraudIndicator[]> {
    const fraudIndicators: FraudIndicator[] = [];

    for (const [fraudType, config] of this.fraudPatterns) {
      const result = await config.check(application, context);
      if (result.detected) {
        fraudIndicators.push({
          type: fraudType as FraudIndicator['type'],
          severity: result.severity,
          description: result.description,
          evidence: result.evidence
        });
      }
    }

    return fraudIndicators;
  }

  private async checkDuplicateApplications(
    application: DonationApplication, 
    context: VerificationRequest['context']
  ): Promise<{ detected: boolean; severity: FraudIndicator['severity']; description: string; evidence: string[] }> {
    const recentApplications = context.previousApplications.filter(a => 
      a.id !== application.id && 
      Math.abs(new Date(a.submittedAt).getTime() - new Date(application.submittedAt).getTime()) < 30 * 24 * 60 * 60 * 1000 // 30 days
    );

    const similarApplications = recentApplications.filter(a => {
      const similarityScore = this.calculateApplicationSimilarity(application, a);
      return similarityScore > 0.8; // 80% similarity threshold
    });

    if (similarApplications.length > 0) {
      return {
        detected: true,
        severity: 'high',
        description: 'Application shows high similarity to recent submissions',
        evidence: [
          `Found ${similarApplications.length} similar applications in the last 30 days`,
          'Similar personal information and financial details',
          'Matching reason patterns and urgency levels'
        ]
      };
    }

    return { detected: false, severity: 'low', description: '', evidence: [] };
  }

  private async checkSuspiciousIncome(
    application: DonationApplication, 
    context: VerificationRequest['context']
  ): Promise<{ detected: boolean; severity: FraudIndicator['severity']; description: string; evidence: string[] }> {
    const suspiciousPatterns: string[] = [];

    // Check for round numbers that seem artificial
    if (application.monthlyIncome % 1000 === 0 && application.monthlyIncome > 0) {
      suspiciousPatterns.push('Income is exact round number');
    }

    // Check for income inconsistent with employment status
    if (application.employmentStatus === 'unemployed' && application.monthlyIncome > 2000) {
      suspiciousPatterns.push('High income reported while unemployed');
    }

    if (application.employmentStatus === 'part-time' && application.monthlyIncome > 4000) {
      suspiciousPatterns.push('High income for part-time employment');
    }

    // Check for income inconsistent with household size
    const incomePerCapita = application.monthlyIncome / application.householdSize;
    if (incomePerCapita > 3000 && application.monthlyIncome < 5000) {
      suspiciousPatterns.push('Income inconsistent with household size');
    }

    if (suspiciousPatterns.length > 0) {
      return {
        detected: true,
        severity: 'medium',
        description: 'Income information shows suspicious patterns',
        evidence: suspiciousPatterns
      };
    }

    return { detected: false, severity: 'low', description: '', evidence: [] };
  }

  private async checkInconsistentInformation(
    application: DonationApplication, 
    context: VerificationRequest['context']
  ): Promise<{ detected: boolean; severity: FraudIndicator['severity']; description: string; evidence: string[] }> {
    const inconsistencies: string[] = [];

    // Check for inconsistencies in reason vs financial situation
    if (application.reasonForApplication.toLowerCase().includes('unemployed') && 
        application.employmentStatus !== 'unemployed') {
      inconsistencies.push('Reason mentions unemployment but status shows otherwise');
    }

    if (application.reasonForApplication.toLowerCase().includes('low income') && 
        application.monthlyIncome > 3000) {
      inconsistencies.push('Claims low income but reports moderate earnings');
    }

    // Check for urgency inconsistency
    const hasImmediateNeeds = application.reasonForApplication.toLowerCase().includes('urgent') ||
                              application.reasonForApplication.toLowerCase().includes('emergency') ||
                              application.reasonForApplication.toLowerCase().includes('immediate');
    
    if (hasImmediateNeeds && application.urgencyLevel === 'low') {
      inconsistencies.push('Reason suggests urgency but low priority selected');
    }

    if (inconsistencies.length > 0) {
      return {
        detected: true,
        severity: 'medium',
        description: 'Application contains inconsistent information',
        evidence: inconsistencies
      };
    }

    return { detected: false, severity: 'low', description: '', evidence: [] };
  }

  private async checkFakeDocuments(
    application: DonationApplication, 
    context: VerificationRequest['context']
  ): Promise<{ detected: boolean; severity: FraudIndicator['severity']; description: string; evidence: string[] }> {
    // This would typically involve document verification APIs
    // For now, we'll do basic checks
    
    const documentIssues: string[] = [];

    // Check for suspicious document patterns
    if (application.supportingDocuments.length === 0) {
      documentIssues.push('No supporting documents provided');
    }

    if (application.supportingDocuments.length > 10) {
      documentIssues.push('Unusually high number of documents');
    }

    // Check document file types and sizes (basic validation)
    application.supportingDocuments.forEach(doc => {
      if (!doc.match(/\.(pdf|jpg|jpeg|png)$/i)) {
        documentIssues.push(`Suspicious file type: ${doc}`);
      }
    });

    if (documentIssues.length > 0) {
      return {
        detected: true,
        severity: 'low',
        description: 'Document validation issues detected',
        evidence: documentIssues
      };
    }

    return { detected: false, severity: 'low', description: '', evidence: [] };
  }

  private async checkMultipleAccounts(
    application: DonationApplication, 
    context: VerificationRequest['context']
  ): Promise<{ detected: boolean; severity: FraudIndicator['severity']; description: string; evidence: string[] }> {
    // Check for applications with similar personal information
    const similarUsers = context.previousApplications.filter(a => 
      a.id !== application.id && (
        a.email === application.email ||
        a.phone === application.phone ||
        (a.firstName === application.firstName && a.lastName === application.lastName)
      )
    );

    if (similarUsers.length > 0) {
      return {
        detected: true,
        severity: 'high',
        description: 'Multiple applications detected with same personal information',
        evidence: [
          `Found ${similarUsers.length} other applications with matching personal details`,
          'Same email, phone, or name used in multiple applications',
          'Potential attempt to bypass application limits'
        ]
      };
    }

    return { detected: false, severity: 'low', description: '', evidence: [] };
  }

  private calculateApplicationSimilarity(app1: DonationApplication, app2: DonationApplication): number {
    let similarityScore = 0;
    let totalFactors = 0;

    // Compare names
    if (app1.firstName === app2.firstName) similarityScore += 1;
    if (app1.lastName === app2.lastName) similarityScore += 1;
    totalFactors += 2;

    // Compare financial information
    const incomeDiff = Math.abs(app1.monthlyIncome - app2.monthlyIncome);
    if (incomeDiff < 500) similarityScore += 1;
    if (app1.householdSize === app2.householdSize) similarityScore += 1;
    if (app1.employmentStatus === app2.employmentStatus) similarityScore += 1;
    totalFactors += 3;

    // Compare reasons (basic text similarity)
    const reasonSimilarity = this.calculateTextSimilarity(app1.reasonForApplication, app2.reasonForApplication);
    similarityScore += reasonSimilarity;
    totalFactors += 1;

    // Compare urgency
    if (app1.urgencyLevel === app2.urgencyLevel) similarityScore += 1;
    totalFactors += 1;

    return totalFactors > 0 ? similarityScore / totalFactors : 0;
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  private async analyzeApplicationBehavior(application: DonationApplication): Promise<BehavioralAnalysis> {
    const languageAnalysis = await this.analyzeApplicationLanguage(application);
    const applicationPattern = this.determineApplicationPattern(application);
    const riskBehaviors = this.identifyRiskBehaviors(application);

    return {
      applicationPattern,
      languageAnalysis,
      riskBehaviors
    };
  }

  private async analyzeApplicationLanguage(application: DonationApplication): Promise<BehavioralAnalysis['languageAnalysis']> {
    // This would typically use NLP services for sentiment analysis
    // For now, we'll use basic keyword analysis
    
    const reason = application.reasonForApplication.toLowerCase();
    
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    const emotionalIndicators: string[] = [];
    
    // Basic sentiment analysis
    const positiveWords = ['grateful', 'thankful', 'appreciate', 'hope', 'positive', 'better'];
    const negativeWords = ['desperate', 'hopeless', 'struggling', 'difficult', 'impossible', 'terrible'];
    
    const positiveCount = positiveWords.filter(word => reason.includes(word)).length;
    const negativeCount = negativeWords.filter(word => reason.includes(word)).length;
    
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';
    
    // Extract emotional indicators
    if (reason.includes('depressed') || reason.includes('anxiety')) {
      emotionalIndicators.push('mental health concerns');
    }
    
    if (reason.includes('family') || reason.includes('children')) {
      emotionalIndicators.push('family responsibilities');
    }
    
    if (reason.includes('job') || reason.includes('work')) {
      emotionalIndicators.push('employment concerns');
    }
    
    // Calculate authenticity score based on various factors
    const authenticityScore = this.calculateAuthenticityScore(application, sentiment);

    return {
      sentiment,
      emotionalIndicators,
      authenticityScore
    };
  }

  private calculateAuthenticityScore(application: DonationApplication, sentiment: string): number {
    let score = 50; // Base score
    
    // Length factor (not too short, not too long)
    const reasonLength = application.reasonForApplication.length;
    if (reasonLength >= 100 && reasonLength <= 1000) score += 20;
    else if (reasonLength < 50) score -= 30;
    else if (reasonLength > 2000) score -= 10;
    
    // Specific details factor
    const hasSpecificDetails = application.reasonForApplication.includes('$') || 
                               application.reasonForApplication.includes('month') ||
                               application.reasonForApplication.includes('week');
    if (hasSpecificDetails) score += 15;
    
    // Emotional authenticity
    if (sentiment === 'negative' && application.urgencyLevel === 'high') score += 10;
    if (sentiment === 'positive' && application.monthlyIncome < 2000) score -= 20; // Inconsistent
    
    return Math.max(0, Math.min(100, score));
  }

  private determineApplicationPattern(application: DonationApplication): BehavioralAnalysis['applicationPattern'] {
    const submissionTime = new Date(application.submittedAt).getTime();
    const startOfDay = new Date(application.submittedAt).setHours(0, 0, 0, 0);
    const timeSinceStartOfDay = submissionTime - startOfDay;
    
    // Check if submitted very quickly (less than 5 minutes)
    const isQuickSubmission = timeSinceStartOfDay < 5 * 60 * 1000;
    
    // Check for rushed patterns
    const hasMinimalDetails = application.reasonForApplication.length < 100;
    const hasNoDocuments = application.supportingDocuments.length === 0;
    
    if (isQuickSubmission && hasMinimalDetails) return 'rushed';
    if (hasMinimalDetails && hasNoDocuments) return 'suspicious';
    if (application.urgencyLevel === 'high' && application.reasonForApplication.includes('desperate')) return 'desperate';
    
    return 'normal';
  }

  private identifyRiskBehaviors(application: DonationApplication): string[] {
    const risks: string[] = [];
    
    if (application.reasonForApplication.length < 50) {
      risks.push('Minimal explanation provided');
    }
    
    if (application.supportingDocuments.length === 0) {
      risks.push('No supporting documentation');
    }
    
    if (application.monthlyIncome === 0 && application.employmentStatus !== 'unemployed') {
      risks.push('Zero income with employment status mismatch');
    }
    
    return risks;
  }

  private async assessUrgency(application: DonationApplication): Promise<UrgencyAssessment> {
    const urgencyScore = this.calculateUrgencyScore(application);
    const keyFactors: string[] = [];
    let timelineRisk: UrgencyAssessment['timelineRisk'] = 'low';
    const supportingEvidence: string[] = [];

    // Analyze urgency indicators
    if (application.urgencyLevel === 'high') {
      keyFactors.push('Self-reported high urgency');
      urgencyScore += 30;
    } else if (application.urgencyLevel === 'medium') {
      keyFactors.push('Self-reported medium urgency');
      urgencyScore += 15;
    }

    // Check for crisis indicators
    const reason = application.reasonForApplication.toLowerCase();
    const crisisWords = ['emergency', 'crisis', 'immediate', 'urgent', 'desperate', 'suicide', 'harm'];
    const foundCrisisWords = crisisWords.filter(word => reason.includes(word));
    
    if (foundCrisisWords.length > 0) {
      keyFactors.push(`Crisis indicators: ${foundCrisisWords.join(', ')}`);
      urgencyScore += 25;
      timelineRisk = 'immediate';
      supportingEvidence.push(`Contains crisis-related language: ${foundCrisisWords.join(', ')}`);
    }

    // Check for time-sensitive issues
    const timeSensitiveWords = ['eviction', 'homeless', 'unemployed', 'medical', 'hospital'];
    const foundTimeSensitive = timeSensitiveWords.filter(word => reason.includes(word));
    
    if (foundTimeSensitive.length > 0) {
      keyFactors.push(`Time-sensitive issues: ${foundTimeSensitive.join(', ')}`);
      urgencyScore += 20;
      if (timelineRisk === 'low') timelineRisk = 'short_term';
      supportingEvidence.push(`Mentions time-sensitive issues: ${foundTimeSensitive.join(', ')}`);
    }

    // Financial urgency indicators
    if (application.monthlyIncome < 1000) {
      keyFactors.push('Very low income');
      urgencyScore += 15;
      supportingEvidence.push('Monthly income below $1000');
    }

    if (application.employmentStatus === 'unemployed') {
      keyFactors.push('Currently unemployed');
      urgencyScore += 10;
      supportingEvidence.push('Reports unemployment status');
    }

    return {
      urgencyScore: Math.min(100, urgencyScoreValue),
      keyFactors,
      timelineRisk,
      supportingEvidence
    };
  }

  private calculateUrgencyScore(application: DonationApplication): number {
    let score = 0;
    
    // Base urgency from self-reported level
    switch (application.urgencyLevel) {
      case 'high': score += 30; break;
      case 'medium': score += 15; break;
      case 'low': score += 5; break;
    }
    
    // Financial urgency
    if (application.monthlyIncome < 1000) score += 20;
    else if (application.monthlyIncome < 2000) score += 10;
    
    // Employment urgency
    if (application.employmentStatus === 'unemployed') score += 15;
    else if (application.employmentStatus === 'part-time') score += 5;
    
    return Math.min(100, score);
  }

  private calculateNeedScore(analysis: Partial<AIApplicationAnalysis>, request: VerificationRequest): number {
    let needScore = 0;
    let factors = 0;

    // Financial need
    if (analysis.financialAssessment) {
      needScore += analysis.financialAssessment.affordabilityScore;
      factors++;
    }

    // Urgency need
    if (analysis.urgencyAssessment) {
      needScore += analysis.urgencyAssessment.urgencyScore;
      factors++;
    }

    // Adjust for fraud indicators
    if (analysis.fraudIndicators && analysis.fraudIndicators.length > 0) {
      const fraudPenalty = analysis.fraudIndicators.reduce((sum, indicator) => {
        const penalty = indicator.severity === 'high' ? 30 : indicator.severity === 'medium' ? 15 : 5;
        return sum + penalty;
      }, 0);
      needScore -= Math.min(needScore, fraudPenalty);
    }

    return factors > 0 ? Math.max(0, Math.min(100, needScore / factors)) : 0;
  }

  private calculateConfidence(analysis: Partial<AIApplicationAnalysis>, verificationLevel: string): number {
    let confidence = 50; // Base confidence
    let factors = 0;

    // Financial analysis confidence
    if (analysis.financialAssessment) {
      confidence += 20;
      factors++;
    }

    // Fraud detection confidence
    if (analysis.fraudIndicators) {
      confidence += 15;
      factors++;
    }

    // Behavioral analysis confidence
    if (analysis.behavioralAnalysis) {
      confidence += 15;
      factors++;
    }

    // Adjust based on verification level
    switch (verificationLevel) {
      case 'comprehensive': confidence += 10; break;
      case 'enhanced': confidence += 5; break;
    }

    return Math.min(100, confidence);
  }

  private generateAnalysisRecommendation(analysis: Partial<AIApplicationAnalysis>): 'approve' | 'reject' | 'review_further' {
    if (!analysis.needScore || !analysis.confidence) return 'review_further';

    // High confidence, high need = approve
    if (analysis.confidence > 80 && analysis.needScore > 70) return 'approve';
    
    // High confidence, low need = reject
    if (analysis.confidence > 80 && analysis.needScore < 30) return 'reject';
    
    // Fraud indicators = reject
    if (analysis.fraudIndicators && analysis.fraudIndicators.some(f => f.severity === 'high')) return 'reject';
    
    // Medium confidence = review further
    if (analysis.confidence < 60) return 'review_further';
    
    // Default to review further for edge cases
    return 'review_further';
  }

  private generateAnalysisExplanation(analysis: Partial<AIApplicationAnalysis>): string {
    const explanations: string[] = [];

    if (analysis.financialAssessment) {
      if (analysis.financialAssessment.affordabilityScore > 70) {
        explanations.push('Financial assessment indicates significant affordability challenges');
      } else if (analysis.financialAssessment.affordabilityScore < 30) {
        explanations.push('Financial situation appears relatively stable');
      }
    }

    if (analysis.urgencyAssessment) {
      if (analysis.urgencyAssessment.urgencyScore > 70) {
        explanations.push('High urgency level with supporting evidence');
      } else if (analysis.urgencyAssessment.urgencyScore < 30) {
        explanations.push('Lower urgency indicators present');
      }
    }

    if (analysis.fraudIndicators && analysis.fraudIndicators.length > 0) {
      const highRiskFraud = analysis.fraudIndicators.filter(f => f.severity === 'high').length;
      if (highRiskFraud > 0) {
        explanations.push(`${highRiskFraud} high-risk fraud indicators detected`);
      }
    }

    if (analysis.behavioralAnalysis) {
      if (analysis.behavioralAnalysis.languageAnalysis?.authenticityScore < 50) {
        explanations.push('Application authenticity concerns identified');
      }
    }

    return explanations.length > 0 ? explanations.join('. ') : 'Standard verification completed';
  }

  private generateRecommendation(
    analysis: AIApplicationAnalysis, 
    request: VerificationRequest
  ): VerificationRecommendation {
    const recommendation: Partial<VerificationRecommendation> = {};

    // Determine action based on AI analysis
    switch (analysis.recommendation) {
      case 'approve':
        recommendation.action = 'approve';
        recommendation.priority = 'medium';
        recommendation.reasoning = 'AI analysis indicates genuine need with acceptable risk level';
        recommendation.humanReviewRequired = false;
        break;
        
      case 'reject':
        recommendation.action = 'reject';
        recommendation.priority = 'high';
        recommendation.reasoning = 'AI analysis identifies significant risk factors or fraud indicators';
        recommendation.humanReviewRequired = true; // Always require human review for rejections
        break;
        
      case 'review_further':
      default:
        recommendation.action = 'review_manual';
        recommendation.priority = analysis.confidence > 70 ? 'medium' : 'high';
        recommendation.reasoning = 'AI analysis requires human judgment for final decision';
        recommendation.humanReviewRequired = true;
        break;
    }

    // Add conditions if needed
    if (analysis.needScore && analysis.needScore < 50 && analysis.confidence > 60) {
      recommendation.conditions = ['Additional financial documentation may be required'];
    }

    return recommendation as VerificationRecommendation;
  }

  private storeVerificationResult(userId: string, result: VerificationResult): void {
    const userHistory = this.verificationHistory.get(userId) || [];
    userHistory.unshift(result);
    
    // Keep only last 50 results
    if (userHistory.length > 50) {
      userHistory.splice(50);
    }
    
    this.verificationHistory.set(userId, userHistory);
  }

  async getVerificationHistory(userId: string): Promise<VerificationResult[]> {
    return this.verificationHistory.get(userId) || [];
  }

  async getVerificationStats(userId: string): Promise<{
    totalVerifications: number;
    approvalRate: number;
    averageNeedScore: number;
    fraudDetectionRate: number;
  }> {
    const history = this.verificationHistory.get(userId) || [];
    
    if (history.length === 0) {
      return {
        totalVerifications: 0,
        approvalRate: 0,
        averageNeedScore: 0,
        fraudDetectionRate: 0
      };
    }

    const approvals = history.filter(h => h.analysis.recommendation === 'approve').length;
    const fraudDetections = history.filter(h => h.analysis.fraudIndicators && h.analysis.fraudIndicators.length > 0).length;
    const totalNeedScore = history.reduce((sum, h) => sum + (h.analysis.needScore || 0), 0);

    return {
      totalVerifications: history.length,
      approvalRate: (approvals / history.length) * 100,
      averageNeedScore: totalNeedScore / history.length,
      fraudDetectionRate: (fraudDetections / history.length) * 100
    };
  }
}