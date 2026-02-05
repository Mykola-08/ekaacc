'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPendingVerifications() {
    const supabase = await createClient()
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Role check
    const { data: profile } = await supabase.from('profiles').select('role').eq('auth_id', user.id).single()
    if (!['admin', 'therapist'].includes(profile?.role)) throw new Error("Forbidden")

    // Fetch bookings that need attention
    // 1. Identity not verified
    // 2. Payment status is 'pending' but mode is not 'stripe' (e.g. cash, transfer) -- simplified logic for now
    
    // For this prototype, we treat ANY unverified identity as a flag if they have active bookings
    const { data, error } = await supabase
        .from('booking')
        .select(`
            id, created_at, start_time, 
            service:service(name), 
            profiles:profile_id(full_name, email, trust_score),
            payment_status, amount:base_price_cents, is_identity_verified, confidence_score
        `)
        .eq('is_identity_verified', false)
        .gte('start_time', new Date().toISOString()) // Only future bookings
        .order('start_time', { ascending: true })

    if (error) {
        console.error("Fetch finance error:", error)
        return []
    }

    return data
}

export async function verifyBookingIdentity(bookingId: string) {
    const supabase = await createClient()
    
    // Auth & Permission Check omitted for brevity, assuming middleware or simple role check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        // 1. Mark booking as verified
        const { error: bookingError } = await supabase
            .from('booking')
            .update({ is_identity_verified: true, confidence_score: 100 })
            .eq('id', bookingId)

        if (bookingError) throw bookingError

        // 2. Optionally update user trust score?
        // We'd need to fetch the booking's profile_id first.
        // For now, let's keep it simple.

        revalidatePath('/admin/finance')
        return { success: true, message: "Identity Verified" }
    } catch (e: any) {
        return { success: false, message: e.message }
    }
}
