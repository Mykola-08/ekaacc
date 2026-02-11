'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import {
  Loader2,
  Copy,
  Check,
  Gift,
  Users,
  Clock,
  DollarSign,
  Share2,
  QrCode,
} from 'lucide-react';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { InlineFeedbackCompact } from '@/components/ui/inline-feedback';
import {
  getOrCreateReferralCode,
  getReferralStats,
  getReferralHistory,
  applyReferralCode,
  type ReferralCode,
  type ReferralStats,
  type ReferralUsage,
} from '@/app/actions/referral';

export function ReferralDashboard() {
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [stats, setStats] = useState<ReferralStats>({
    totalReferred: 0,
    pendingRewards: 0,
    completedRewards: 0,
    totalEarnings: 0,
  });
  const [history, setHistory] = useState<ReferralUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Apply referral code state
  const [applyCode, setApplyCode] = useState('');
  const [applying, setApplying] = useState(false);

  const applyFeedback = useMorphingFeedback();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [codeResult, statsResult, historyResult] = await Promise.all([
      getOrCreateReferralCode(),
      getReferralStats(),
      getReferralHistory(),
    ]);

    if (codeResult.success && codeResult.referralCode) {
      setReferralCode(codeResult.referralCode);
    }
    setStats(statsResult);
    setHistory(historyResult.history);
    setLoading(false);
  };

  const copyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode.code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const copyLink = () => {
    if (!referralCode) return;
    const link = `${window.location.origin}/signup?ref=${referralCode.code}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const shareReferral = async () => {
    if (!referralCode) return;
    const link = `${window.location.origin}/signup?ref=${referralCode.code}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join EKA Balance',
          text: 'Sign up with my referral link and we both earn rewards!',
          url: link,
        });
      } catch {
        // User cancelled or error, just copy instead
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  const handleApplyReferralCode = async () => {
    if (!applyCode.trim()) return;
    setApplying(true);
    applyFeedback.reset();

    const result = await applyReferralCode(applyCode.trim());
    if (result.success) {
      applyFeedback.setSuccess('Referral code applied! You\'ll earn rewards on your first booking.');
      setApplyCode('');
    } else {
      applyFeedback.setError(result.error || 'Failed to apply code');
    }

    setApplying(false);
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
      className="space-y-8"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: 'Total Referred',
            value: stats.totalReferred,
            icon: Users,
            color: 'text-primary bg-primary/10',
          },
          {
            label: 'Pending',
            value: stats.pendingRewards,
            icon: Clock,
            color: 'text-warning bg-warning/10',
          },
          {
            label: 'Completed',
            value: stats.completedRewards,
            icon: Check,
            color: 'text-success bg-success/10',
          },
          {
            label: 'Earned',
            value: `€${stats.totalEarnings}`,
            icon: DollarSign,
            color: 'text-success bg-success/10',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg border border-border/50 bg-card p-5 shadow-sm"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Your Referral Code */}
      <div className="bg-card rounded-lg border border-border/50 p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Gift className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Your Referral Code</h3>
            <p className="text-sm text-muted-foreground">
              Share this code with friends. You both earn €10 when they complete their first booking.
            </p>
          </div>
        </div>

        {referralCode && (
          <div className="space-y-4">
            {/* Code Display */}
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-4 text-center">
                <span className="font-mono text-2xl font-bold tracking-[0.3em] text-primary">
                  {referralCode.code}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={copyCode}
                className="h-14 w-14 shrink-0 rounded-xl"
              >
                {codeCopied ? (
                  <Check className="h-5 w-5 text-success" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={copyLink}
                variant="outline"
                className="h-11 flex-1 rounded-full font-semibold"
              >
                {linkCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button
                onClick={shareReferral}
                className="h-11 flex-1 rounded-full bg-primary font-semibold text-primary-foreground shadow-sm"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Apply a Referral Code */}
      <div className="bg-card rounded-lg border border-border/50 p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-1">Have a Referral Code?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enter a code from a friend to earn rewards on your first booking.
        </p>
        <div className="flex gap-3">
          <Input
            value={applyCode}
            onChange={(e) => setApplyCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="h-11 flex-1 rounded-md border-input bg-muted/50 px-4 font-mono text-base tracking-wider uppercase transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
            maxLength={12}
          />
          <Button
            onClick={handleApplyReferralCode}
            disabled={applying || !applyCode.trim()}
            className="h-11 rounded-full bg-primary px-6 font-semibold text-primary-foreground"
          >
            {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
          </Button>
        </div>
        <InlineFeedbackCompact
          status={applyFeedback.status}
          message={applyFeedback.message}
          onDismiss={applyFeedback.reset}
        />
      </div>

      {/* Referral History */}
      {history.length > 0 && (
        <div className="bg-card rounded-lg border border-border/50 p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Referral History</h3>
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-secondary p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.referred_user?.full_name || 'Referred User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={item.status === 'completed' ? 'default' : 'secondary'}
                  className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="rounded-lg border border-border/30 bg-secondary/30 p-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">How Referrals Work</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Share Your Code',
              desc: 'Send your unique referral code or link to friends and family.',
            },
            {
              step: '2',
              title: 'They Sign Up',
              desc: 'Your friend creates an account using your referral code.',
            },
            {
              step: '3',
              title: 'Both Earn Rewards',
              desc: 'When they complete their first booking, you both receive €10 credit.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
