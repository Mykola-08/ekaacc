
'use client';

import { motion } from 'framer-motion';
import { Switch } from '@/components/keep';
import { ReactNode } from 'react';

interface NotificationSwitchProps {
  id: string;
  label: string;
  icon: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function NotificationSwitch({ id, label, icon, checked, onCheckedChange }: NotificationSwitchProps) {
  return (
    <motion.div
      className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-blue-600"
      />
    </motion.div>
  );
}
