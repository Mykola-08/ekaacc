'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { Button } from '@/components/platform/ui/button';
import { motion } from 'framer-motion';

export function ThemeSelector() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) return null;

  const themes = [
    { id: 'light', name: 'Light', icon: Sun, color: 'from-yellow-400 to-orange-500' },
    { id: 'dark', name: 'Dark', icon: Moon, color: 'from-slate-600 to-slate-800' },
    { id: 'auto', name: 'Auto', icon: Palette, color: 'from-blue-400 to-purple-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <motion.button
              key={themeOption.id}
              onClick={() => handleThemeChange(themeOption.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                theme === themeOption.id
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              whileHover={{ y: -2, opacity: 0.95 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${themeOption.color} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700">{themeOption.name}</span>
              {theme === themeOption.id && (
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
      <p className="text-sm text-slate-600">
        Choose your preferred theme. Auto mode will follow your system settings.
      </p>
    </div>
  );
}