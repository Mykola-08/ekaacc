"use client";

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PersonaSwitcher: React.FC = () => {
  const setPersona = (p: string | null) => {
    try {
      if (p) localStorage.setItem('eka_persona', p);
      else localStorage.removeItem('eka_persona');
      // Also set a cookie so server middleware can read persona in demo mode
      const domain = process.env.NODE_ENV === 'production' ? '; domain=.ekabalance.com' : '';
      if (p) {
        document.cookie = `eka_persona=${encodeURIComponent(p)}; path=/; max-age=${60 * 60 * 24 * 30}${domain}`;
      } else {
        document.cookie = `eka_persona=; path=/; max-age=0${domain}`;
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
    const effectiveValue = value === 'default' ? '' : value;
    setPersona(effectiveValue || null);
    setCurrentPersona(effectiveValue);
  };

  return (
    <div className="flex flex-col gap-1.5 p-2 bg-muted/50 rounded-lg border border-border/50">
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
        Dev Mode
      </label>
      <Select value={currentPersona || 'default'} onValueChange={handleChange}>
        <SelectTrigger className="w-full h-9 text-sm bg-background border-border shadow-sm hover:border-primary/50 focus:ring-primary/20">
          <SelectValue placeholder="Select Persona" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">🔄 Auto</SelectItem>
          <SelectItem value="Admin">👑 Admin</SelectItem>
          <SelectItem value="Therapist">👨‍⚕️ Therapist</SelectItem>
          <SelectItem value="Patient">👤 Patient</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PersonaSwitcher;
