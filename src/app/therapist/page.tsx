"use client";

import { useData } from "@/context/unified-data-context";
import { RoleChanger } from "@/components/ui/role-changer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TherapistDashboard() {
  const { sessions, currentUser } = useData();

  // Filter sessions assigned to the current therapist
  const mySessions = sessions.filter(
    session => session.therapist === currentUser?.displayName
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <RoleChanger />
      <h1 className="text-3xl font-bold mb-6">Therapist Dashboard</h1>
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">My Bookings</h2>
        <ul>
          {mySessions.map(session => (
            <li key={session.id} className="flex justify-between items-center py-2 border-b">
              <span>{session.date} - {session.type}</span>
              <Button size="sm" variant="outline">View</Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
