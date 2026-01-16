export interface MonitoringOptions {
    privacyLevel?: 'minimal' | 'comprehensive';
    proactiveSuggestions?: boolean;
}

export class AIBackgroundMonitor {
    async start() {
        // Stub implementation
        console.warn("AIBackgroundMonitor.start called (stub)");
    }
    
    async stop() {
        // Stub implementation
        console.warn("AIBackgroundMonitor.stop called (stub)");
    }
    
    async initializeMonitoring(_userId: string, _options?: MonitoringOptions) {
        // Stub implementation
        console.warn("AIBackgroundMonitor.initializeMonitoring called (stub)");
    }
}
