'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Gift, Share2, Award } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

export function ReferralWidget() {
  const [referralCode, setReferralCode] = useState('EKALOVE2026');
  const [points, setPoints] = useState(350);
  const [nextReward, setNextReward] = useState(500);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://eka.app/join?ref=${referralCode}`);
    toast.success("Referral link copied to clipboard!");
  };

  const progress = (points / nextReward) * 100;

  return (
    <Card className="border-emerald-100 dark:border-emerald-900/50 bg-linear-to-b from-white to-emerald-50/20 dark:from-background dark:to-emerald-950/10">
      <CardHeader>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
            <Gift className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Rewards Program</span>
        </div>
        <CardTitle className="text-2xl">Invite Friends, Get Sessions</CardTitle>
        <CardDescription>
          Your friends get 10% off their first session. You get 500 points.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Progress Section */}
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
                <span className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> My Points: {points}</span>
                <span className="text-muted-foreground">{nextReward - points} to next reward</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">Reach {nextReward} pts for a free 30min session</p>
        </div>

        {/* Link Section */}
        <div className="flex gap-2">
            <div className="grid flex-1 gap-2">
                <Input 
                    readOnly 
                    value={`https://eka.app/join?ref=${referralCode}`} 
                    className="bg-background text-muted-foreground"
                />
            </div>
            <Button onClick={copyToClipboard} size="icon" variant="outline">
                <Copy className="h-4 w-4" />
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
