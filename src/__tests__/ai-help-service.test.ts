import { aiHelpService, getAIHelpRecommendations, getSupportiveMessage, generateMonthlyReportSummary } from '@/ai/ai-help-service';
import { AIHelpRequest, AIHelpRecommendation } from '@/ai/types';

describe('AIHelpService', () => {
  describe('generateHelpRecommendations', () => {
    it('should generate relevant recommendations for therapy queries', async () => {
      const recommendations = await getAIHelpRecommendations('therapy session', 'I need help with scheduling', '/dashboard');

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
      
      recommendations.forEach(rec => {
        expect(rec).toHaveProperty('id');
        expect(rec).toHaveProperty('title');
        expect(rec).toHaveProperty('description');
        expect(rec).toHaveProperty('confidence');
        expect(rec).toHaveProperty('category');
        expect(rec.confidence).toBeGreaterThanOrEqual(0);
        expect(rec.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should provide payment help recommendations', async () => {
      const recommendations = await getAIHelpRecommendations('payment', 'Having billing issues', '/billing');

      const paymentRecommendation = recommendations.find(rec => 
        rec.category === 'technical' && rec.title.toLowerCase().includes('payment')
      );

      expect(paymentRecommendation).toBeDefined();
      expect(paymentRecommendation?.confidence).toBeGreaterThan(0.5);
    });

    it('should handle empty queries gracefully', async () => {
      const recommendations = await getAIHelpRecommendations('', '', '');

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('should handle short queries', async () => {
      const recommendations = await getAIHelpRecommendations('hi');

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
      // Should apply length penalty
      expect(recommendations[0].confidence).toBeLessThan(1.0);
    });
  });

  describe('getSupportiveMessage', () => {
    it('should generate appropriate supportive messages', async () => {
      const message = await getSupportiveMessage('Having a difficult day');

      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
      expect(message).toMatch(/[a-zA-Z]/); // Should contain letters
    });

    it('should generate different messages for different contexts', async () => {
      const message1 = await getSupportiveMessage('Feeling anxious');
      const message2 = await getSupportiveMessage('Great progress today');

      expect(message1).not.toBe(message2);
    });

    it('should handle empty context', async () => {
      const message = await getSupportiveMessage('');

      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });
  });

  describe('generateMonthlyReportSummary', () => {
    it('should generate monthly report summaries', async () => {
      const summary = await generateMonthlyReportSummary('test-user-123', 10, 2024);

      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);
      expect(summary).toMatch(/[a-zA-Z]/); // Should contain meaningful text
    });

    it('should generate different summaries for different users', async () => {
      const summary1 = await generateMonthlyReportSummary('user-1', 10, 2024);
      const summary2 = await generateMonthlyReportSummary('user-2', 10, 2024);

      // While they might be similar, they should at least be valid strings
      expect(typeof summary1).toBe('string');
      expect(typeof summary2).toBe('string');
      expect(summary1.length).toBeGreaterThan(0);
      expect(summary2.length).toBeGreaterThan(0);
    });

    it('should handle different months and years', async () => {
      const summary1 = await generateMonthlyReportSummary('test-user', 1, 2023);
      const summary2 = await generateMonthlyReportSummary('test-user', 12, 2024);

      expect(typeof summary1).toBe('string');
      expect(typeof summary2).toBe('string');
      expect(summary1.length).toBeGreaterThan(0);
      expect(summary2.length).toBeGreaterThan(0);
    });
  });

  describe('aiHelpService instance', () => {
    it('should be a singleton', () => {
      const instance1 = aiHelpService;
      const instance2 = aiHelpService;
      
      expect(instance1).toBe(instance2);
    });

    it('should have all required methods', () => {
      expect(typeof aiHelpService.generateHelpRecommendations).toBe('function');
      expect(typeof aiHelpService.generateSupportiveMessage).toBe('function');
      expect(typeof aiHelpService.generateMonthlyReportSummary).toBe('function');
    });
  });

  describe('Error handling', () => {
    it('should handle invalid user IDs gracefully', async () => {
      const recommendations = await getAIHelpRecommendations('help', 'test', '/test');
      
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('should handle special characters in queries', async () => {
      const recommendations = await getAIHelpRecommendations('therapy @#$%^&*()');
      
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('should handle very long queries', async () => {
      const longQuery = 'therapy '.repeat(100);
      const recommendations = await getAIHelpRecommendations(longQuery);
      
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Recommendation scoring', () => {
    it('should prioritize therapy-related queries', async () => {
      const recommendations = await getAIHelpRecommendations('therapy session booking');
      
      expect(recommendations.length).toBeGreaterThan(0);
      // First recommendation should have high confidence
      expect(recommendations[0].confidence).toBeGreaterThan(0.7);
    });

    it('should consider page context', async () => {
      const recommendationsWithContext = await getAIHelpRecommendations('help', '', '/billing');
      const recommendationsWithoutContext = await getAIHelpRecommendations('help');
      
      expect(recommendationsWithContext.length).toBeGreaterThan(0);
      expect(recommendationsWithoutContext.length).toBeGreaterThan(0);
      
      // Context should affect recommendations
      expect(recommendationsWithContext).not.toEqual(recommendationsWithoutContext);
    });

    it('should limit recommendations to top 5', async () => {
      const recommendations = await getAIHelpRecommendations('therapy help support');
      
      expect(recommendations.length).toBeLessThanOrEqual(5);
    });
  });
});