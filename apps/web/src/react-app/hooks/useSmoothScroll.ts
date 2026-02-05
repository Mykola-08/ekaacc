import { useContext } from 'react';
import { SmoothScrollContext } from '@/react-app/contexts/smoothScrollContext';

export const useSmoothScroll = () => {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider');
  }
  return context;
};
