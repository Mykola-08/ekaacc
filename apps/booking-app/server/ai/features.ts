import { getAIClient, getModel } from './provider';

interface SessionSummaryResult {
    summary: string;
    keyThemes: string[];
    actionItems: string[];
    sentiment: string;
}

export async function generateSessionSummary(notes: string): Promise<SessionSummaryResult> {
    const ai = await getAIClient();
    const model = await getModel();

    const response = await ai.chat.completions.create({
        model: model,
        messages: [
            {
                role: "system",
                content: `You are an expert clinical supervisor and therapist assistant. 
                Your goal is to summarize clinical notes into a structured format using professional language (SOAP/DAP style where appropriate).
                Maintain strict confidentiality and objectivity.`
            },
            {
                role: "user",
                content: `Analyze the following session notes and provide:
                1. A brief professional summary (3-4 sentences).
                2. Key themes discussed.
                3. Agreed operational action items or homework.
                4. General emotional sentiment of the session.

                Output as JSON:
                {
                    "summary": "...",
                    "keyThemes": ["..."],
                    "actionItems": ["..."],
                    "sentiment": "Positive" | "Neutral" | "Distressed" | "Hopeful"
                }

                Notes:
                ${notes}`
            }
        ],
        response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("AI returned empty response");

    return JSON.parse(content) as SessionSummaryResult;
}

interface SentimentTrendResult {
    analysis: string;
    alertLevel: 'low' | 'medium' | 'high';
    suggestions: string[];
}

export async function analyzeBiweeklySentiment(journalEntries: { content: string, date: string }[]): Promise<SentimentTrendResult> {
    const ai = await getAIClient();
    const model = await getModel();

    if (journalEntries.length === 0) {
        return { analysis: "Not enough data.", alertLevel: 'low', suggestions: [] };
    }

    const entriesText = journalEntries.map(e => `[${e.date}]: ${e.content}`).join('\n');

    const response = await ai.chat.completions.create({
        model: model,
        messages: [
            {
                role: "system",
                content: "You are an AI wellness companion tracking emotional progression over time."
            },
            {
                role: "user",
                content: `Analyze these journal entries from the last 2 weeks for emotional trajectory.
                Identify if the user is spiraling, improving, or stable.
                
                Entries:
                ${entriesText}

                Return JSON:
                {
                    "analysis": "A compassionate paragraph summary addressing the user.",
                    "alertLevel": "low" (stable), "medium" (needs attention), "high" (crisis risk),
                    "suggestions": ["3 actionable self-care tips"]
                }`
            }
        ],
        response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("AI returned empty response");

    return JSON.parse(content) as SentimentTrendResult;
}
