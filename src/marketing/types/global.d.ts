export { };

declare global {
    interface Window {
        gtag: (
            command: 'config' | 'event' | 'consent' | 'set',
            targetIdOrAction: string,
            config?: Record<string, unknown>
        ) => void;
    }
}
