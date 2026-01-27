import { createContext } from 'react';

export interface SmoothScrollContextType {
  scrollToSection: (elementId: string, offset?: number) => void;
}

export const SmoothScrollContext = createContext<SmoothScrollContextType | undefined>(undefined);
