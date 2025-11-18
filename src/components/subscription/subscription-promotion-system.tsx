'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Heart, 
  Gift, 
  Star, 
  TrendingUp, 
  Users, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  HandHeart,
  Sparkles,
  ArrowRight,
  Calendar,
  Award
} from 'lucide-react';
import { TextShimmer } from '@/components/magicui/text-shimmer';
import { BlurIn } from '@/components/magicui/blur-in';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  aiLimit: number;
  description: string;
  popular?: boolean;
  donationEligible?: boolean;
}

interface DonationApplication {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  financialSituation: string;
  monthlyIncome: number;
  householdSize: number;
  employmentStatus: string;
  reasonForApplication: string;
  supportingDocuments: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  aiAnalysis?: {
    needScore: number;
    confidence: number;
    riskFactors: string[];
    recommendation: 'approve' | 'reject' | 'review_further';
    explanation: string;
  };
}

interface SubscriptionPromotionData {
  currentTier: string;
  usageStats: {
    aiChatsUsed: number;
    aiLimit: number;
    sessionsCompleted: number;
    totalSessions: number;
  };
  donationStats: {
    totalApplications: number;
    approvedApplications: number;
    pendingApplications: number;
    totalDonationsReceived: number;
  };
}

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    features: [
      '50 AI conversations per month',
      'Basic wellness tracking',
      'Standard session booking',
      'Email support',
      'Basic progress reports'
    ],
    aiLimit: 50,
    description: 'Perfect for getting started with AI-powered wellness support',
    donationEligible: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 59,
    features: [
      '200 AI conversations per month',
      'Advanced wellness insights',
      'Priority session booking',
      'Priority email & chat support',
      'Detailed progress analytics',
      'AI-powered recommendations',
      'Custom wellness plans'
    ],
    aiLimit: 200,
    description: 'Comprehensive wellness support with advanced AI features',
    popular: true,
    donationEligible: true
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 99,
    features: [
      '1000 AI conversations per month',
      'Unlimited wellness tracking',
      'Instant session booking',
      '24/7 priority support',
      'Advanced AI analytics',
      'Personalized AI assistant',
      'Therapist matching',
      'Crisis support priority'
    ],
    aiLimit: 1000,
    description: 'Elite wellness experience with unlimited AI support',
    donationEligible: false
  }
];

export default function SubscriptionPromotionSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donationApplication, setDonationApplication] = useState<Partial<DonationApplication>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promotionData, setPromotionData] = useState<SubscriptionPromotionData>({
    currentTier: 'basic',
    usageStats: {
      aiChatsUsed: 35,
      aiLimit: 50,
      sessionsCompleted: 3,
      totalSessions: 5
    },
    donationStats: {
      totalApplications: 1247,
      approvedApplications: 892,
      pendingApplications: 45,
      totalDonationsReceived: 156780
    }
  });

  const handleDonationApplication = async () => {
    if (!user?.id) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Application Submitted',
        description: 'Your donation application has been received and will be reviewed within 24-48 hours.',
        duration: 5000,
      });
      
      setShowDonationForm(false);
      setDonationApplication({});
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const aiUsagePercentage = (promotionData.usageStats.aiChatsUsed / promotionData.usageStats.aiLimit) * 100;
  const sessionCompletionPercentage = (promotionData.usageStats.sessionsCompleted / promotionData.usageStats.totalSessions) * 100;

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <BlurIn>
          <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-purple-500" />
            Unlock Your Wellness Journey
          </h1>
        </BlurIn>
        <TextShimmer className="text-xl text-muted-foreground">
          Get access to advanced AI-powered wellness support and personalized care
        </TextShimmer>
      </div>

      {/* Current Usage Overview */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Your Current Progress
          </CardTitle>
          <CardDescription>
            Track your wellness journey and see how upgrading can enhance your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Conversations Used</span>
                <Badge variant="outline" className="text-purple-600">
                  {promotionData.usageStats.aiChatsUsed}/{promotionData.usageStats.aiLimit}
                </Badge>
              </div>
              <Progress value={aiUsagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {promotionData.usageStats.aiLimit - promotionData.usageStats.aiChatsUsed} conversations remaining this month
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sessions Completed</span>
                <Badge variant="outline" className="text-green-600">
                  {promotionData.usageStats.sessionsCompleted}/{promotionData.usageStats.totalSessions}
                </Badge>
              </div>
              <Progress value={sessionCompletionPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Great progress! Keep up the momentum
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Tiers */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <BlurIn>
            <h2 className="text-3xl font-bold">Choose Your Plan</h2>
          </BlurIn>
          <TextShimmer className="text-muted-foreground">
            Select the perfect plan for your wellness needs
          </TextShimmer>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <Card key={tier.id} className={`relative ${tier.popular ? 'border-purple-300 shadow-lg scale-105' : 'border-gray-200'}`}>
              {tier.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 pt-4">
                  {tier.id === promotionData.currentTier ? (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <RainbowButton className="w-full">
                      Upgrade to {tier.name}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </RainbowButton>
                  )}
                  
                  {tier.donationEligible && (
                    <Dialog open={showDonationForm} onOpenChange={setShowDonationForm}>
                      <DialogTrigger asChild>
                        <ShimmerButton className="w-full text-sm bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700">
                          <HandHeart className="h-4 w-4 mr-2" />
                          Need financial assistance?
                        </ShimmerButton>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            Financial Assistance Application
                          </DialogTitle>
                          <DialogDescription>
                            We believe everyone deserves access to mental wellness support. 
                            If you're experiencing financial hardship, please apply for our donation-based program.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 py-4">
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Important Information</AlertTitle>
                            <AlertDescription>
                              This program is designed for individuals experiencing genuine financial hardship. 
                              All applications are reviewed by our team and AI verification system. 
                              Please provide accurate information to help us assess your need.
                            </AlertDescription>
                          </Alert>
                          
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">First Name</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md"
                                value={donationApplication.firstName || ''}
                                onChange={(e) => setDonationApplication(prev => ({ ...prev, firstName: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Last Name</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md"
                                value={donationApplication.lastName || ''}
                                onChange={(e) => setDonationApplication(prev => ({ ...prev, lastName: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Email</label>
                              <input
                                type="email"
                                className="w-full px-3 py-2 border rounded-md"
                                value={donationApplication.email || ''}
                                onChange={(e) => setDonationApplication(prev => ({ ...prev, email: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Phone</label>
                              <input
                                type="tel"
                                className="w-full px-3 py-2 border rounded-md"
                                value={donationApplication.phone || ''}
                                onChange={(e) => setDonationApplication(prev => ({ ...prev, phone: e.target.value }))}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Monthly Income ($)</label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 border rounded-md"
                              value={donationApplication.monthlyIncome || ''}
                              onChange={(e) => setDonationApplication(prev => ({ ...prev, monthlyIncome: parseInt(e.target.value) }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Household Size</label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 border rounded-md"
                              value={donationApplication.householdSize || ''}
                              onChange={(e) => setDonationApplication(prev => ({ ...prev, householdSize: parseInt(e.target.value) }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Employment Status</label>
                            <select
                              className="w-full px-3 py-2 border rounded-md"
                              value={donationApplication.employmentStatus || ''}
                              onChange={(e) => setDonationApplication(prev => ({ ...prev, employmentStatus: e.target.value }))}
                            >
                              <option value="">Select status</option>
                              <option value="unemployed">Unemployed</option>
                              <option value="part-time">Part-time</option>
                              <option value="full-time">Full-time</option>
                              <option value="self-employed">Self-employed</option>
                              <option value="student">Student</option>
                              <option value="disabled">Disabled</option>
                              <option value="retired">Retired</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Reason for Application</label>
                            <textarea
                              className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                              placeholder="Please describe your financial situation and why you need assistance..."
                              value={donationApplication.reasonForApplication || ''}
                              onChange={(e) => setDonationApplication(prev => ({ ...prev, reasonForApplication: e.target.value }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Urgency Level</label>
                            <select
                              className="w-full px-3 py-2 border rounded-md"
                              value={donationApplication.urgencyLevel || ''}
                              onChange={(e) => setDonationApplication(prev => ({ ...prev, urgencyLevel: e.target.value as 'low' | 'medium' | 'high' }))}
                            >
                              <option value="">Select urgency</option>
                              <option value="low">Low - Can wait 2-4 weeks</option>
                              <option value="medium">Medium - Need help within 1-2 weeks</option>
                              <option value="high">High - Need immediate assistance</option>
                            </select>
                          </div>
                          
                          <div className="flex justify-end space-x-3 pt-4">
                            <Button variant="outline" onClick={() => setShowDonationForm(false)}>
                              Cancel
                            </Button>
                            <RainbowButton onClick={handleDonationApplication} disabled={isSubmitting}>
                              {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </RainbowButton>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Donation Impact Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Making a Difference Together
          </CardTitle>
          <CardDescription>
            See how our community supports those in need
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">
                <NumberTicker value={promotionData.donationStats.totalApplications} />
              </div>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">
                <NumberTicker value={promotionData.donationStats.approvedApplications} />
              </div>
              <p className="text-sm text-muted-foreground">Approved Applications</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-600">
                <NumberTicker value={promotionData.donationStats.pendingApplications} />
              </div>
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-pink-600">
                $<NumberTicker value={promotionData.donationStats.totalDonationsReceived} />
              </div>
              <p className="text-sm text-muted-foreground">Total Support Provided</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Success Stories
          </CardTitle>
          <CardDescription>
            Hear from our community members who have benefited from our programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <p className="font-medium">Sarah M.</p>
                  <p className="text-xs text-muted-foreground">Premium Member</p>
                </div>
              </div>
              <p className="text-sm italic">
                "The AI insights have been life-changing. I can track my mood patterns and get personalized 
                recommendations that actually work. The premium features are worth every penny."
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <p className="font-medium">Michael R.</p>
                  <p className="text-xs text-muted-foreground">Donation Recipient</p>
                </div>
              </div>
              <p className="text-sm italic">
                "During a difficult financial period, the donation program gave me access to therapy 
                sessions I couldn't afford. I'm forever grateful for this support system."
              </p>
              <Badge variant="outline" className="text-green-600">
                <Heart className="h-3 w-3 mr-1" />
                Donation Program
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center space-y-4 p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
        <BlurIn>
          <h3 className="text-2xl font-bold">Ready to Transform Your Wellness Journey?</h3>
        </BlurIn>
        <TextShimmer className="text-muted-foreground">
          Join thousands who have already improved their mental health with our AI-powered platform
        </TextShimmer>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <RainbowButton size="lg">
            Start Free Trial
            <ArrowRight className="h-4 w-4 ml-2" />
          </RainbowButton>
          <Button size="lg" variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Demo
          </Button>
        </div>
      </div>
    </div>
  );
}