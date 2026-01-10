export class AISDKNextService {
    private static instance: AISDKNextService;
    static getInstance() {
        if (!this.instance) {
            this.instance = new AISDKNextService();
        }
        return this.instance;
    }
}
