'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Shield, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { challengeMFA, verifyMFAChallenge } from '@/app/actions/mfa';
import { fadeInUpLarge, scaleIn, fadeInLeft, fadeInUpSmall, fadeIn, withDelay } from '@/lib/motion';

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
    <motion.div
      variants={fadeInUpLarge}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-md flex-col gap-6"
    >
      <Card className="relative overflow-hidden rounded-3xl border border-border/20 bg-card/70 shadow-sm backdrop-blur-2xl">
        <CardContent className="relative p-8 md:p-10">
          {/* Header */}
          <motion.div
            variants={withDelay(scaleIn, 0.1)}
            initial="hidden"
            animate="visible"
            className="mb-8 flex flex-col items-center gap-4 text-center"
          >
            <div className="relative mb-2">
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border/10 bg-primary/10 shadow-sm">
                <Shield className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Two-Factor Authentication
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
          </motion.div>

          {/* Code Input */}
          <motion.div
            variants={withDelay(fadeInLeft, 0.2)}
            initial="hidden"
            animate="visible"
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
                  className="h-14 w-12 rounded-md border-input bg-muted/50 text-center text-xl font-semibold transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
                  disabled={loading}
                />
              ))}
            </div>
          </motion.div>

          {/* Error */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-center text-sm font-medium text-destructive"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.div
            variants={withDelay(fadeInUpSmall, 0.3)}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <Button
              onClick={() => handleSubmit()}
              className="h-12 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow active:scale-[0.98] disabled:opacity-70"
              disabled={loading || code.some((d) => !d)}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Verify'
              )}
            </Button>

            {onCancel && (
              <Button
                variant="ghost"
                onClick={onCancel}
                className="h-10 w-full rounded-full text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
