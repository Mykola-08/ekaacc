'use client';

import { DashboardLayout } from "@/components/dashboard/layout/DashboardLayout";
import { AvailabilityManager } from "@/components/dashboard/widgets/AvailabilityManager";

export default function AvailabilityPage() {
    return (
        <DashboardLayout profile={{ first_name: 'Therapist' }}>
            <div className="animate-in fade-in duration-500">
                <AvailabilityManager />
            </div>
        </DashboardLayout>
    );
}
