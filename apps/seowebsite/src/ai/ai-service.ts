export interface TherapyRecommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  confidence: number;
  category?: string;
  action?: () => void;
}

export async function generateTherapyRecommendations(_userId_or_query: string, _context?: any, _page?: string): Promise<TherapyRecommendation[]> {
  console.warn("generateTherapyRecommendations called (stub)");
  return [
    {
      id: "rec_1",
      title: "Mindfulness Session",
      description: "Try a 5-minute mindfulness session to reduce stress.",
      type: "activity",
      confidence: 0.9
    }
  ];
}

export async function generateAIResponse(_query: string, _context?: any): Promise<string> {
  console.warn("generateAIResponse called (stub)");
  return "This is a placeholder AI response. The actual AI service needs to be connected.";
}

export async function generateWellnessInsights(_userId: string): Promise<string[]> {
  console.warn("generateWellnessInsights called (stub)");
  return ["Get enough sleep", "Stay hydrated", "Practice mindfulness"];
}

export class AIService {
  async generateText(_query: string): Promise<string> {
    return "Stub response";
  }
}
