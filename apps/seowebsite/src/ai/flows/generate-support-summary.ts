export interface SupportSummaryInput {
    receiverName: string;
    donorNames: string[];
    supportDetails: string;
    progressDetails: string;
}

export interface SupportSummaryResult {
    summary: string;
    progress: string;
}

export async function generateSupportSummary(_input: SupportSummaryInput): Promise<SupportSummaryResult> {
    return { 
        summary: 'Stub Summary',
        progress: 'Stub Progress'
    };
}
