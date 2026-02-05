'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function buyPlan(planId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        const { data, error } = await supabase.rpc('purchase_plan_atomic', {
            p_user_id: user.id,
            p_plan_id: planId
        });

        if (error) {
            console.error("Purchase failed:", error);
            return { error: error.message };
        }

        revalidatePath('/dashboard');
        revalidatePath('/wallet');
        return { success: true, planUsageId: data };

    } catch (e: any) {
        return { error: e.message || "Transaction failed" };
    }
}

export async function getAvailablePlans() {
    const supabase = await createClient();
    const { data } = await supabase.from('plan_definition').select('*').eq('active', true).order('price_cents', { ascending: true });
    return data || [];
}
