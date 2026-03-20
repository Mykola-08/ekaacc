'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { challengeMFA, verifyMFAChallenge } from '@/app/actions/mfa';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon, ShieldIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';

interface MFAVerifyFormProps {
  factorId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MFAVerifyForm({ factorId, onSuccess, onCancel }: MFAVerifyFormProps) {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Create challenge on mount
  useEffect(() => {
    const createChallenge = async () => {
      const result = await challengeMFA(factorId);
      if (result.success && result.challengeId) {
        setChallengeId(result.challengeId);
      } else {
        setError(result.error || 'Failed to initialize verification');
      }
    };
    createChallenge();
  }, [factorId]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;

      const newCode = [...code];
      newCode[index] = value.slice(-1);
      setCode(newCode);
      setError(null);

      // Auto-advance
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all digits entered
      if (value && index === 5 && newCode.every((d) => d !== '')) {
        handleSubmit(newCode.join(''));
      }
    },
    [code]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [code]
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      handleSubmit(pasted);
    }
  }, []);

  const handleSubmit = async (fullCode?: string) => {
    const codeStr = fullCode || code.join('');
    if (codeStr.length !== 6 || !challengeId) return;

    setLoading(true);
    setError(null);

    const result = await verifyMFAChallenge(factorId, challengeId, codeStr);

    if (result.success) {
      onSuccess?.();
      router.push('/dashboard');
    } else {
      setError(result.error || 'Invalid code. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

      // Refresh challenge
      const newChallenge = await challengeMFA(factorId);
      if (newChallenge.success && newChallenge.challengeId) {
        setChallengeId(newChallenge.challengeId);
      }
    }

    setLoading(false);
  };

  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col gap-6"
    >
      <Card className="border-border/20 bg-card/70 relative overflow-hidden rounded-[calc(var(--radius)*0.8)] border backdrop-blur-2xl">
        <CardContent className="relative p-8 md:p-10">
          {/* Header */}
          <div
            className="mb-8 flex flex-col items-center gap-4 text-center"
          >
            <div className="relative mb-2">
              <div className="border-border/10 bg-primary/10 relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-[calc(var(--radius)*0.8)] border">
                <HugeiconsIcon icon={ShieldIcon} className="text-primary size-7"  />
              </div>
            </div>
            <div className="">
              <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                Two-Factor Authentication
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
          </div>

          {/* Code Input */}
          <div
            className="mb-6"
          >
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {code.map((digit, i) => (
                <Input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="border-input bg-muted/50 focus:border-primary focus:bg-background focus:ring-primary/10 h-14 w-12 rounded-[var(--radius)] text-center text-xl font-semibold transition-all focus:ring-4"
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          {/* Error */}
          
            {error && (
              <div
                className="bg-destructive/10 text-destructive mb-4 rounded-[var(--radius)] px-4 py-3 text-center text-sm font-medium"
              >
                {error}
              </div>
            )}
          

          {/* Submit */}
          <div
            className=""
          >
            <Button
              onClick={() => handleSubmit()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full rounded-full text-sm font-semibold transition-all hover:shadow active:scale-[0.98] disabled:opacity-70"
              disabled={loading || code.some((d) => !d)}
            >
              {loading ? <HugeiconsIcon icon={Loading03Icon} className="size-5 animate-spin"  /> : 'Verify'}
            </Button>

            {onCancel && (
              <Button
                variant="ghost"
                onClick={onCancel}
                className="text-muted-foreground hover:text-foreground h-10 w-full rounded-full text-sm font-medium"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 size-4"  />
                Back to login
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
