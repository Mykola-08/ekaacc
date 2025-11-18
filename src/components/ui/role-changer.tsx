"use client";

import { Button } from '@/components/ui/button';
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/supabase-auth";
import { useAppStore } from "@/store/app-store";
import { User } from "@/lib/types";

const roles = [
  "Patient",
  "Therapist",
  "Admin"
] as const;

type Role = typeof roles[number];

export function RoleChanger() {
  const { user: currentUser } = useAuth();
  const { dataService, initDataService } = useAppStore();
  const [selectedRole, setSelectedRole] = useState<Role>(
    currentUser?.role && roles.includes(currentUser.role as unknown as Role) ? currentUser.role as unknown as Role : "Patient"
  );
  const [isDonationSeeker, setIsDonationSeeker] = useState(false); // Removed donation seeker functionality

  useEffect(() => {
    initDataService();
  }, [initDataService]);

  useEffect(() => {
    if (currentUser) {
      setSelectedRole(
        currentUser.role && roles.includes(currentUser.role as unknown as Role) ? currentUser.role as unknown as Role : "Patient"
      );
      // setIsDonationSeeker(!!currentUser.isDonationSeeker); // Removed donation seeker functionality
    }
  }, [currentUser]);

  const updateUser = async (userData: Partial<User>) => {
    if (dataService && currentUser) {
      await dataService.updateUser(currentUser.id, userData);
      try { /* no refresh available in supabase auth context */ } catch {}
    }
  };

  const handleChange = (role: Role) => {
    setSelectedRole(role);
    updateUser({ role });
    try { localStorage.setItem('eka_persona', role); } catch {}
    // notify other components (sidebar) to update
    try { window.dispatchEvent(new CustomEvent('eka_persona_change', { detail: role })); } catch {}
  };
  const handleDonationSeeker = (checked: boolean) => {
    setIsDonationSeeker(checked);
    updateUser({ isDonationSeeker: checked });
  };

  return (
    <div className="flex gap-2 items-center p-2 border rounded mb-4">
      <span className="font-medium">Role:</span>
      {roles.map(role => (
        <Button
          key={role}
          variant={selectedRole === role ? "default" : "outline"}
          onClick={() => handleChange(role)}
        >
          {role}
        </Button>
      ))}
      {selectedRole === "Patient" && (
        <label className="ml-4 flex items-center gap-2">
          <input type="checkbox" checked={isDonationSeeker} onChange={e => handleDonationSeeker(e.target.checked)} />
          <span>Donation Seeker</span>
        </label>
      )}
    </div>
  );
}
