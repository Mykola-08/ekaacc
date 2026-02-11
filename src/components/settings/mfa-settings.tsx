'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Shield, ShieldCheck, ShieldOff, Copy, Check, Smartphone } from 'lucide-react';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { InlineFeedbackCompact } from '@/components/ui/inline-feedback';
import {
  enrollMFA,
  verifyMFAEnrollment,
  unenrollMFA,
  getMFAFactors,
} from '@/app/actions/mfa';

interface MFAFactor {
  id: string;
  friendly_name?: string;
  factor_type: string;
  status: string;
  created_at: string;
}

export function MFASettings() {
  const [factors, setFactors] = useState<MFAFactor[]>([]);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setupOpen, setSetupOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);

  // Setup state
  const [setupStep, setSetupStep] = useState<'qr' | 'verify'>('qr');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [factorId, setFactorId] = useState('');
  const [verifyCode, setVerifyCode] = useState(['', '', '', '', '', '']);
  const [setupLoading, setSetupLoading] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setupFeedback = useMorphingFeedback();
  const disableFeedback = useMorphingFeedback();

  // Load MFA status
  useEffect(() => {
    loadFactors();
  }, []);

  const loadFactors = async () => {
    setLoading(true);
    const result = await getMFAFactors();
    setFactors(result.factors as MFAFactor[]);
    setMfaEnabled(result.enabled);
    setLoading(false);
  };

  // ─── Setup Flow ────────────────────────────────────────────────

  const startSetup = async () => {
    setSetupLoading(true);
    setupFeedback.reset();

    const result = await enrollMFA();
    if (result.success) {
      setQrCode(result.qrCode!);
      setSecret(result.secret!);
      setFactorId(result.factorId!);
      setSetupStep('qr');
      setSetupOpen(true);
    } else {
      setupFeedback.setError(result.error || 'Failed to start MFA setup');
    }

    setSetupLoading(false);
  };

  const handleCodeChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const newCode = [...verifyCode];
      newCode[index] = value.slice(-1);
      setVerifyCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [verifyCode]
  );

  const handleCodeKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !verifyCode[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [verifyCode]
  );

  const handleCodePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setVerifyCode(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  }, []);

  const verifySetup = async () => {
    const codeStr = verifyCode.join('');
    if (codeStr.length !== 6) return;

    setSetupLoading(true);
    const result = await verifyMFAEnrollment(factorId, codeStr);

    if (result.success) {
      setupFeedback.setSuccess('MFA enabled successfully!');
      setSetupOpen(false);
      setVerifyCode(['', '', '', '', '', '']);
      await loadFactors();
    } else {
      setupFeedback.setError(result.error || 'Invalid code');
      setVerifyCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }

    setSetupLoading(false);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 2000);
  };

  // ─── Disable Flow ──────────────────────────────────────────────

  const handleDisableMFA = async () => {
    if (factors.length === 0) return;

    setSetupLoading(true);
    const result = await unenrollMFA(factors[0].id);

    if (result.success) {
      disableFeedback.setSuccess('MFA has been disabled');
      setDisableOpen(false);
      await loadFactors();
    } else {
      disableFeedback.setError(result.error || 'Failed to disable MFA');
    }

    setSetupLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* MFA Status Card */}
      <div className="bg-secondary flex items-center justify-between rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${
              mfaEnabled ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
            }`}
          >
            {mfaEnabled ? (
              <ShieldCheck className="h-6 w-6" />
            ) : (
              <Shield className="h-6 w-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-foreground text-lg font-semibold">
                Two-Factor Authentication
              </span>
              <Badge
                variant={mfaEnabled ? 'default' : 'secondary'}
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              >
                {mfaEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {mfaEnabled
                ? 'Your account is protected with an authenticator app'
                : 'Add an extra layer of security to your account'}
            </p>
          </div>
        </div>

        {mfaEnabled ? (
          <Dialog open={disableOpen} onOpenChange={setDisableOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-full border-destructive/30 px-6 font-semibold text-destructive hover:bg-destructive/10"
              >
                <ShieldOff className="mr-2 h-4 w-4" />
                Disable
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Disable Two-Factor Authentication?</DialogTitle>
                <DialogDescription>
                  This will remove the extra layer of security from your account.
                  You can always re-enable it later.
                </DialogDescription>
              </DialogHeader>
              <InlineFeedbackCompact
                status={disableFeedback.status}
                message={disableFeedback.message}
                onDismiss={disableFeedback.reset}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDisableOpen(false)}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDisableMFA}
                  disabled={setupLoading}
                  className="rounded-lg"
                >
                  {setupLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Disable MFA
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            onClick={startSetup}
            disabled={setupLoading}
            className="h-10 rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-sm"
          >
            {setupLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Shield className="mr-2 h-4 w-4" />
            )}
            Enable MFA
          </Button>
        )}
      </div>

      <InlineFeedbackCompact
        status={setupFeedback.status}
        message={setupFeedback.message}
        onDismiss={setupFeedback.reset}
      />

      {/* Active Factors */}
      {mfaEnabled && factors.length > 0 && (
        <div className="bg-secondary/50 rounded-lg border border-border/30 p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Active Authentication Methods
          </h3>
          {factors.map((factor) => (
            <div
              key={factor.id}
              className="flex items-center justify-between rounded-lg bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {factor.friendly_name || 'Authenticator App'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(factor.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="rounded-full text-xs">
                TOTP
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Setup Dialog */}
      <Dialog
        open={setupOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSetupStep('qr');
            setVerifyCode(['', '', '', '', '', '']);
          }
          setSetupOpen(open);
        }}
      >
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Set Up Two-Factor Authentication
            </DialogTitle>
            <DialogDescription>
              {setupStep === 'qr'
                ? 'Scan the QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.)'
                : 'Enter the 6-digit code from your authenticator app to verify setup'}
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {setupStep === 'qr' ? (
              <motion.div
                key="qr"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 py-4"
              >
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="overflow-hidden rounded-2xl border border-border/30 bg-card p-4 shadow-sm">
                    <img
                      src={qrCode}
                      alt="MFA QR Code"
                      className="h-48 w-48"
                    />
                  </div>
                </div>

                {/* Manual Entry */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Or enter this code manually:
                  </Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded-lg bg-muted px-4 py-2.5 font-mono text-sm tracking-wider">
                      {secret}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copySecret}
                      className="h-10 w-10 shrink-0 rounded-lg"
                    >
                      {secretCopied ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSetupStep('verify');
                    setTimeout(() => inputRefs.current[0]?.focus(), 100);
                  }}
                  className="h-11 w-full rounded-full bg-primary font-semibold text-primary-foreground"
                >
                  I&apos;ve scanned the code
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 py-4"
              >
                <div
                  className="flex justify-center gap-3"
                  onPaste={handleCodePaste}
                >
                  {verifyCode.map((digit, i) => (
                    <Input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      className="h-14 w-12 rounded-md border-input bg-muted/50 text-center text-xl font-semibold transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
                      disabled={setupLoading}
                    />
                  ))}
                </div>

                <InlineFeedbackCompact
                  status={setupFeedback.status}
                  message={setupFeedback.message}
                  onDismiss={setupFeedback.reset}
                />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSetupStep('qr')}
                    className="h-11 flex-1 rounded-full font-semibold"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={verifySetup}
                    disabled={setupLoading || verifyCode.some((d) => !d)}
                    className="h-11 flex-1 rounded-full bg-primary font-semibold text-primary-foreground"
                  >
                    {setupLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      'Verify & Enable'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
