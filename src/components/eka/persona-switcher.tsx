"use client";

import React from 'react';

export const PersonaSwitcher: React.FC = () => {
  const setPersona = (p: string | null) => {
    try {
      if (p) localStorage.setItem('eka_persona', p);
      else localStorage.removeItem('eka_persona');
      // Also set a cookie so server middleware can read persona in demo mode
      if (p) {
        document.cookie = `eka_persona=${encodeURIComponent(p)}; path=/; max-age=${60 * 60 * 24 * 30}`;
      } else {
        document.cookie = `eka_persona=; path=/; max-age=0`;
      }
      window.dispatchEvent(new CustomEvent('eka_persona_change', { detail: p }));
    } catch (e) {
      // ignore
    }
  };

  const [currentPersona, setCurrentPersona] = React.useState('');

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('eka_persona');
      setCurrentPersona(stored || '');
    } catch (e) {
      // ignore
    }
  }, []);

  const handleChange = (value: string) => {
    setPersona(value || null);
    setCurrentPersona(value);
  };

  return (
    <div className="flex flex-col gap-1.5 p-2 bg-muted/50 rounded-lg border border-border/50">
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
        Dev Mode
      </label>
      <select 
        className="text-sm px-2 py-1.5 bg-background border border-border rounded-md shadow-sm hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
        onChange={(e) => handleChange(e.target.value)}
        value={currentPersona}
      >
        <option value="">🔄 Auto</option>
        <option value="Admin">👑 Admin</option>
        <option value="Therapist">👨‍⚕️ Therapist</option>
        <option value="Patient">👤 Patient</option>
      </select>
    </div>
  );
};

export default PersonaSwitcher;
