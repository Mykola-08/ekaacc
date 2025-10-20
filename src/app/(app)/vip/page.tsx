'use client';

import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Calendar, Gift, Sparkles, TrendingUp, Star } from 'lucide-react';
import { useData } from '@/context/unified-data-context';
import { Button } from '@/components/ui/button';

export default function VIPLoungePage() {
  const { currentUser } = useData();

  // Redirect if not VIP
  if (!currentUser?.isVip) {
    redirect('/home');
  }

  return (
    <div className="space-y-8">
      {/* VIP Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="h-12 w-12" />
            <div>
              <h1 className="text-4xl font-bold">VIP Lounge</h1>
              <p className="text-yellow-100">Welcome to your exclusive benefits, {currentUser.name}</p>
            </div>
          </div>
          <Badge className="bg-white text-yellow-600 hover:bg-white/90">
            {currentUser.vipTier} Elite Member
          </Badge>
        </div>
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute bottom-0 right-20 -mb-8 h-32 w-32 rounded-full bg-white/10" />
      </div>

      {/* VIP Benefits Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-yellow-500/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-500" />
                Priority Booking
              </CardTitle>
              <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Skip the queue and book your sessions before anyone else.
            </p>
            <Button className="w-full">Book Now</Button>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-yellow-500" />
                Free Sessions
              </CardTitle>
              <Badge variant="outline">{currentUser.vipBenefits?.freeSessionsPerMonth || 0} per month</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Enjoy {currentUser.vipBenefits?.freeSessionsPerMonth} complimentary sessions every month.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-yellow-500/20 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
              <span className="text-sm font-medium">2/3 used</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
                Discount
              </CardTitle>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                {currentUser.vipBenefits?.discountPercentage}% OFF
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Save {currentUser.vipBenefits?.discountPercentage}% on all services and products.
            </p>
            <p className="text-2xl font-bold text-yellow-600">€350</p>
            <p className="text-xs text-muted-foreground">Total savings this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Dedicated Therapist */}
      {currentUser.vipBenefits?.dedicatedTherapist && (
        <Card className="border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Your Dedicated Therapist
            </CardTitle>
            <CardDescription>Personalized care from your assigned wellness expert</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                EC
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Dr. Emily Carter</h3>
                <p className="text-sm text-muted-foreground">Specialized in Physical Therapy & Wellness</p>
                <p className="text-sm text-muted-foreground">15+ years experience</p>
              </div>
              <Button>Contact</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exclusive AI Features */}
      <Card className="border-yellow-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            VIP AI Features
          </CardTitle>
          <CardDescription>Enhanced AI capabilities exclusive to VIP members</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Predictive Wellness Analytics</h4>
              <p className="text-sm text-muted-foreground">
                AI-powered insights that predict your wellness needs before you do.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Advanced Therapy Matching</h4>
              <p className="text-sm text-muted-foreground">
                Sophisticated AI algorithms to find your perfect therapy match.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">24/7 AI Wellness Concierge</h4>
              <p className="text-sm text-muted-foreground">
                Get instant, personalized wellness advice anytime, anywhere.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Status */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="text-lg font-semibold">{currentUser.vipSince ? new Date(currentUser.vipSince).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Renewal Date</p>
              <p className="text-lg font-semibold">{currentUser.vipExpiresAt ? new Date(currentUser.vipExpiresAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">Manage Membership</Button>
        </CardContent>
      </Card>
    </div>
  );
}
