export interface UserInteraction {
    user_id: string;
    interaction_type: string;
    [key: string]: any;
}

export class BehavioralTrackingService {
    private static instance: BehavioralTrackingService;

    static getInstance(): BehavioralTrackingService {
        if (!BehavioralTrackingService.instance) {
            BehavioralTrackingService.instance = new BehavioralTrackingService();
        }
        return BehavioralTrackingService.instance;
    }

    async trackInteraction(interaction: UserInteraction): Promise<void> {
        // Stub
    }
}
