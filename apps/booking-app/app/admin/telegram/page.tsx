import { createClient } from '@/lib/supabase/server';
import { TelegramManager } from "@/components/admin/telegram/TelegramManager";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { redirect } from "next/navigation";

export default async function TelegramAdminPage() {
    const supabase = await createClient();

    // Check Admin Access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.user_metadata.role !== 'admin') {
        redirect('/');
    }

    // Fetch Chats
    const { data: chats } = await supabase
        .from('telegram_chats')
        .select('*')
        .order('updated_at', { ascending: false });

    return (
        <DashboardLayout profile={user.user_metadata}>
            <TelegramManager chats={chats || []} />
        </DashboardLayout>
    );
}
