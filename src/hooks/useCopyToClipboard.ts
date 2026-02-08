import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);
  const toast = useToast();

  const copyToClipboard = useCallback(async (text: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success('Copiat!', successMessage || 'S\'ha copiat al porta-retalls');
      
      // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        setIsCopied(true);
        toast.success('Copiat!', successMessage || 'S\'ha copiat al porta-retalls');
        setTimeout(() => setIsCopied(false), 2000);
      } catch {
        toast.error('Error', 'No s\'ha pogut copiar al porta-retalls');
      }
      
      document.body.removeChild(textArea);
    }
  }, [toast]);

  return { copyToClipboard, isCopied };
}

