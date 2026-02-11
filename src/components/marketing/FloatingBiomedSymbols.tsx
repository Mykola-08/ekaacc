'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Dna,
  Atom,
  FlaskConical,
  Activity,
  Binary,
  TestTube,
  Microscope,
  HeartPulse,
} from 'lucide-react';

// Simple Benzene Ring SVG component
const BenzeneRing = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

// Simple Molecule SVG component
const MoleculeStructure = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <circle cx="19" cy="5" r="2" />
    <circle cx="5" cy="5" r="2" />
    <circle cx="19" cy="19" r="2" />
    <path d="M7 7l3 3" />
    <path d="M17 7l-3 3" />
    <path d="M17 17l-3-3" />
  </svg>
);

const icons = [
  Dna,
  Atom,
  FlaskConical,
  Activity,
  Binary,
  TestTube,
  Microscope,
  HeartPulse,
  BenzeneRing,
  MoleculeStructure,
];
const formulas = [
  'H₂O',
  'ATP',
  'NAD+',
  'C₈H₁₀N₄O₂',
  'C₆H₁₂O₆',
  'O₂',
  'Mg²⁺',
  'Ca²⁺',
  'CH₃COOH',
  'NH₃',
  'Fe²⁺',
  'CO₂',
];

export default function FloatingBiomedSymbols() {
  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    // Generate random elements on client side only to avoid hydration mismatch
    const newElements = [];
    // Generate icons
    for (let i = 0; i < 15; i++) {
      newElements.push({
        id: `icon-${i}`,
        type: 'icon',
        Icon: icons[Math.floor(Math.random() * icons.length)],
        x: Math.random() * 100, // %
        y: Math.random() * 100, // %
        size: 20 + Math.random() * 30, // px
        color: Math.random() > 0.5 ? 'text-info' : 'text-primary', // blue or gold
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 5,
      });
    }
    // Generate formulas
    for (let i = 0; i < 10; i++) {
      newElements.push({
        id: `formula-${i}`,
        type: 'text',
        text: formulas[Math.floor(Math.random() * formulas.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 14 + Math.random() * 10, // text size
        color: Math.random() > 0.5 ? 'text-primary' : 'text-primary',
        duration: 15 + Math.random() * 25,
        delay: Math.random() * 5,
      });
    }
    // Generate complex formulas
    const complexFormulas = ['CH₃-CH₂-OH', 'C₆H₅-OH', 'HO-CH₂-CH(OH)-CH₂-OH'];
    for (let i = 0; i < 5; i++) {
      newElements.push({
        id: `complex-${i}`,
        type: 'text',
        text: complexFormulas[Math.floor(Math.random() * complexFormulas.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 16 + Math.random() * 8,
        color: Math.random() > 0.5 ? 'text-info-foreground' : 'text-primary/90', // slightly darker for readability
        duration: 20 + Math.random() * 20,
        delay: Math.random() * 5,
      });
    }

    setElements(newElements);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className={`absolute opacity-20 ${el.color}`}
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: el.type === 'text' ? `${el.size}px` : undefined,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.4, 0],
            rotate: el.type === 'icon' ? [0, 360] : 0,
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: 'linear',
          }}
        >
          {el.type === 'icon' ? (
            <el.Icon size={el.size} />
          ) : (
            <span className="font-mono font-bold">{el.text}</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
