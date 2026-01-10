export interface TherapyRecommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  confidence: number;
}

export async function generateTherapyRecommendations(userId_or_query: string, context?: any, page?: string): Promise<TherapyRecommendation[]> {
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

export async function generateAIResponse(query: string, context?: any): Promise<string> {
  console.warn("generateAIResponse called (stub)");
  return "This is a placeholder AI response. The actual AI service needs to be connected.";
}
