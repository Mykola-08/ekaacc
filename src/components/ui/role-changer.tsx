"use client";

import { useState } from "react";
import { useData } from "@/context/unified-data-context";
import { Button } from "@/components/ui/button";

const roles = [
  "Patient",
  "Therapist",
  "Admin"
] as const;

type Role = typeof roles[number];

export function RoleChanger() {
  const { currentUser, updateUser } = useData();
  const [selectedRole, setSelectedRole] = useState<Role>(roles.includes(currentUser?.role as Role) ? currentUser?.role as Role : "Patient");
  const [isDonationSeeker, setIsDonationSeeker] = useState(!!currentUser?.isDonationSeeker);

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
