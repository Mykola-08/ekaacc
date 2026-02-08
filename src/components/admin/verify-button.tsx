'use client'

import { useState } from 'react'
import { verifyBookingIdentity } from '@/server/finance/actions'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"

export function VerifyButton({ bookingId }: { bookingId: string }) {
    const [loading, setLoading] = useState(false)

    async function onClick() {
        if (loading) return
        setLoading(true)
        try {
            const res = await verifyBookingIdentity(bookingId)
            if (res.success) {
                toast.success("Identity verified successfully")
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Verification failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button 
            size="sm" 
            onClick={onClick} 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white transition-all active:scale-95"
        >
            {loading ? (
                 <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
            ) : (
                 <CheckCircle className="w-4 h-4 mr-1" />
            )}
            Verify
        </Button>
    )
}

