"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useData } from "@/context/unified-data-context";
import { mockBookings } from "@/lib/mock-bookings";
import { SessionAssessmentForm } from '@/components/eka/forms';

export default function SessionBookingPage() {
  const { currentUser } = useData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isBooked, setIsBooked] = useState(false);

  const handleBook = () => {
    if (selectedDate) {
      setIsBooked(true);
      // TODO: Integrate with backend booking logic
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Book a Therapy Session</h1>
      <Calendar
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="mb-4"
      />
      <Button onClick={handleBook} disabled={!selectedDate || isBooked}>
        {isBooked ? "Session Booked!" : "Book Session"}
      </Button>
      {isBooked && (
        <div className="mt-4 text-green-600">Your session is booked for {selectedDate?.toLocaleDateString()}.</div>
      )}

      {/* Therapist forms only for therapists */}
      {currentUser?.role === 'Therapist' && (
        <div className="mt-8">
          <SessionAssessmentForm
            open={true}
            onClose={() => {}}
            onSubmit={() => {}}
            patientName={"Client"}
            sessionType="pre"
          />
        </div>
      )}
    </div>
  );
}
