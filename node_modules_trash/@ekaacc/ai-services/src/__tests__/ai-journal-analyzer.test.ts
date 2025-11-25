
import { describe, it, expect } from '@jest/globals';
import { AIJournalAnalyzer } from '../ai-journal-analyzer';

describe('AIJournalAnalyzer', () => {
  const analyzer = new AIJournalAnalyzer();

  describe('analyzeEntry', () => {
    it('should analyze a positive entry correctly', async () => {
      const entry = "I had a great, amazing, wonderful day today! I felt happy and productive at work. I'm grateful for my supportive colleagues. Everything is good.";
      const analysis = await analyzer.analyzeEntry('1', entry);

      expect(analysis.sentiment.overall).toBe('positive');
      expect(analysis.sentiment.score).toBeGreaterThan(0);
      expect(analysis.themes).toBeDefined();
      expect(analysis.cognitiveDistortions).toBeDefined();
    });

    it('should analyze a negative entry correctly', async () => {
      const entry = "Today was terrible. I failed at everything and I feel useless. Nothing ever goes right for me.";
      const analysis = await analyzer.analyzeEntry('2', entry);

      expect(analysis.sentiment.overall).toBe('negative'); // or very_negative depending on score
      expect(analysis.sentiment.score).toBeLessThan(0);
    });

    it('should detect emotions', async () => {
      const entry = "I am feeling very anxious about the upcoming presentation, but also excited.";
      const analysis = await analyzer.analyzeEntry('3', entry);

      const emotions = analysis.sentiment.emotions.map(e => e.emotion);
      expect(emotions).toContain('anxiety');
      expect(emotions).toContain('joy'); // 'excited' maps to joy
    });

    it('should extract themes', async () => {
      const entry = "My job is very stressful lately with all the deadlines. I need to sleep more.";
      const analysis = await analyzer.analyzeEntry('4', entry);

      const themes = analysis.themes.map(t => t.theme);
      expect(themes).toContain('work stress');
      expect(themes).toContain('health');
    });

    it('should detect cognitive distortions', async () => {
      const entry = "I always mess things up. Everyone hates me.";
      const analysis = await analyzer.analyzeEntry('5', entry);

      const distortions = analysis.cognitiveDistortions.map(d => d.type);
      // 'always' -> overgeneralization
      // 'everyone hates me' -> all_or_nothing or similar
      expect(distortions.length).toBeGreaterThan(0);
    });
  });
});
