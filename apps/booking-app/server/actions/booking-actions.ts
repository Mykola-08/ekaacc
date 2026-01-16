"use server";

import { cancelBooking } from "@/server/dashboard/service";
import { createBooking, getServiceAvailability } from "@/server/booking/service";
import { revalidatePath } from "next/cache";

export async function cancelBookingAction(bookingId: string, userId: string) {
    const result = await cancelBooking(bookingId, userId);
    if(result.success) {
        revalidatePath('/bookings');
    }
    return result;
}

type BookingActionInput = {
    serviceId: string;
    variantId?: string;
    startTime: Date;
    endTime: Date;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    priceCents: number;
    paymentMode: 'stripe' | 'wallet';
    userId?: string;
};

export async function createNewBookingAction(data: BookingActionInput) {
    // Basic server-side validation
    if (!data.email || !data.serviceId) {
        return { success: false, error: "Missing required fields" };
    }

    const res = await createBooking({
        serviceId: data.serviceId,
        serviceVariantId: data.variantId,
        startTime: data.startTime.toISOString(),
        email: data.email,
        phone: data.phone,
        displayName: `${data.firstName} ${data.lastName}`.trim(),
        paymentMode: 'full', // Default to full payment for online booking
        userId: data.userId,
    });

    if(res.error) {
        return { success: false, error: res.error };
    }

    revalidatePath('/bookings');
    return { success: true, bookingId: res.data?.bookingId };
}

export async function getAvailableSlotsAction(serviceId: string, date: string, variantId?: string) {
    const result = await getServiceAvailability(serviceId, date, variantId);
    
    if (result.error) {
        return { success: false, error: result.error };
    }
    
    return { success: true, data: result.data };
}
