export class AISDKNextService {
    private static instance: AISDKNextService;
    static getInstance() {
        if (!this.instance) {
            this.instance = new AISDKNextService();
        }
        return this.instance;
    }

    async processChatRequest(request: any) {
        return new ReadableStream(); // Return a dummy stream
    }

    async getUsageStats(userId: string, tier: string) {
        return { tokens: 0 };
    }
}
