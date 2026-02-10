import { useState, useCallback } from 'react';

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState(false);

  const copyToClipboard = useCallback(
    async (text: string, _successMessage?: string) => {
      setError(false);
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);

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
          setTimeout(() => setIsCopied(false), 2000);
        } catch {
          setError(true);
          setTimeout(() => setError(false), 3000);
        }

        document.body.removeChild(textArea);
      }
    },
    []
  );

  return { copyToClipboard, isCopied, error };
}
