import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface CopyButtonProps {
  text: string;
  successMessage?: string;
  children?: React.ReactNode;
  className?: string;
}

export function CopyButton({ text, successMessage, children, className = '' }: CopyButtonProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <button
      onClick={() => copyToClipboard(text, successMessage)}
      className={`transition-all duration-200 ${
        isCopied ? 'scale-105 text-green-600' : 'text-muted-foreground hover:text-foreground'
      } ${className}`}
      title={isCopied ? 'Copiat!' : 'Copia al porta-retalls'}
    >
      {children || (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isCopied ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          )}
        </svg>
      )}
    </button>
  );
}
