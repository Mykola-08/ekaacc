export class BroadcastService {
    static async send(args: any) { return { success: true }; }
    static async sendBroadcast(...args: any[]) { return { success: true, count: 1 }; }
}
