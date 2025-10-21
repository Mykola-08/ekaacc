"use client";

import React from 'react';

export const PersonaSwitcher: React.FC = () => {
  const setPersona = (p: string | null) => {
    try {
      if (p) localStorage.setItem('eka_persona', p);
      else localStorage.removeItem('eka_persona');
      window.dispatchEvent(new CustomEvent('eka_persona_change', { detail: p }));
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <label className="text-xs text-muted-foreground">Persona</label>
      <select className="text-sm p-1 border rounded" onChange={(e) => setPersona(e.target.value || null)} defaultValue={localStorage.getItem('eka_persona') || ''}>
        <option value="">Auto</option>
        <option value="Admin">Admin</option>
        <option value="Therapist">Therapist</option>
        <option value="Patient">Patient</option>
      </select>
    </div>
  );
};

export default PersonaSwitcher;
