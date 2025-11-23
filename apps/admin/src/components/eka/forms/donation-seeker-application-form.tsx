'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DonationSeekerApplicationFormProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit: (data: DonationSeekerData) => void;
  onCancel?: () => void;
}

const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  location: z.string().optional(),
});

const financialInfoSchema = z.object({
  currentFinancialSituation: z.string().min(10, 'Please describe your financial situation in detail'),
  monthlyIncome: z.string().optional(),
  employmentStatus: z.string().optional(),
});

const donationSeekerSchema = z.object({
  personalInfo: personalInfoSchema,
  financialInfo: financialInfoSchema,
  mentalHealthHistory: z.string().min(50, 'Please provide at least 50 characters about your mental health history'),
  reasonForSupport: z.string().min(10, 'Please explain why you need support'),
  supportNeeded: z.string().min(1, 'Please select the level of support needed'),
  previousTherapyAccess: z.string().optional(),
  aiRevisedHistory: z.string().optional(),
  aiSuggestions: z.array(z.string()).optional(),
  verificationDocuments: z.array(z.instanceof(File)).optional(),
});

export type DonationSeekerData = z.infer<typeof donationSeekerSchema>;

export function DonationSeekerApplicationForm({ open, onClose, onSubmit }: DonationSeekerApplicationFormProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(donationSeekerSchema),
    defaultValues: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: ''
      },
      financialInfo: {
        currentFinancialSituation: '',
        monthlyIncome: '',
        employmentStatus: ''
      },
      mentalHealthHistory: '',
      reasonForSupport: '',
      supportNeeded: '',
      previousTherapyAccess: '',
      aiRevisedHistory: '',
      aiSuggestions: [],
      verificationDocuments: []
    }
  });

  // Watch form values
  const personalInfo = watch('personalInfo');
  const financialInfo = watch('financialInfo');
  const mentalHealthHistory = watch('mentalHealthHistory');
  const reasonForSupport = watch('reasonForSupport');
  const supportNeeded = watch('supportNeeded');
  const previousTherapyAccess = watch('previousTherapyAccess');

  // AI enhanced fields
  const [aiRevisedHistory, setAiRevisedHistory] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAIResults, setShowAIResults] = useState(false);

  const totalSteps = 4;

  const handleNext = async () => {
    let isValid = false;
    
    if (step === 1) {
      isValid = await trigger('personalInfo');
    } else if (step === 2) {
      isValid = await trigger('financialInfo.currentFinancialSituation');
    } else if (step === 3) {
      isValid = await trigger('mentalHealthHistory');
    }

    if (isValid || step > 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleAIRevision = async () => {
    const isValid = await trigger('mentalHealthHistory');
    if (!isValid || !mentalHealthHistory || mentalHealthHistory.length < 50) {
      toast({
        variant: 'destructive',
        title: 'Please provide more details',
        description: 'AI needs at least a few sentences to provide helpful revisions.',
      });
      return;
    }

    setIsAIProcessing(true);
    toast({
      title: 'AI is analyzing your history...',
      description: 'This may take a moment.',
    });

    // Simulate AI processing with realistic delays
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate AI revision and suggestions
    const revised = `${mentalHealthHistory}\n\n[AI Enhanced Context]: The applicant demonstrates genuine need for mental health support. Their circumstances indicate they would significantly benefit from professional therapy but currently lack the financial means to access these services.`;
    
    const suggestions = [
      'Your history shows consistent challenges that would benefit from ongoing therapy',
      'Consider mentioning specific symptoms or triggers if comfortable',
      'Highlighting your motivation for treatment strengthens your application',
      'Your openness about your situation demonstrates readiness for therapy'
    ];

    setAiRevisedHistory(revised);
    setAiSuggestions(suggestions);
    setShowAIResults(true);
    setIsAIProcessing(false);

    toast({
      title: 'AI analysis complete!',
      description: 'Review the suggestions to improve your application.',
    });
  };

  const handleUseAIVersion = () => {
    setValue('mentalHealthHistory', aiRevisedHistory);
    setShowAIResults(false);
    toast({
      title: 'AI version applied',
      description: 'You can still edit the text if needed.',
    });
  };

  const onFormSubmit = async (data: DonationSeekerData) => {
    setIsLoading(true);
    toast({
      title: 'Submitting your application...',
      description: 'Our team will review it within 48 hours.',
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSubmit({
      ...data,
      aiRevisedHistory: showAIResults ? aiRevisedHistory : undefined,
      aiSuggestions: showAIResults ? aiSuggestions : undefined
    });

    toast({
      title: 'Application submitted successfully!',
      description: 'We\'ll contact you at ' + data.personalInfo.email + ' within 48 hours.',
    });

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Donation Seeker Application
          </DialogTitle>
          <DialogDescription>
            Apply for financial support to access therapy services. All information is confidential.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`h-2 rounded-full flex-1 ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
                {s < totalSteps && <div className="w-2" />}
              </div>
            ))}
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      {...register('personalInfo.fullName')}
                      className="mt-2"
                    />
                    {errors.personalInfo?.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.personalInfo.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      {...register('personalInfo.email')}
                      className="mt-2"
                    />
                    {errors.personalInfo?.email && (
                      <p className="text-sm text-destructive mt-1">{errors.personalInfo.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      {...register('personalInfo.phone')}
                      className="mt-2"
                    />
                    {errors.personalInfo?.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.personalInfo.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location">Location (City, Country)</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Amsterdam, Netherlands"
                      {...register('personalInfo.location')}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Financial Information */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This information is strictly confidential and used only to assess eligibility for donation support.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="financialSituation">Current Financial Situation *</Label>
                    <Textarea
                      id="financialSituation"
                      placeholder="Please describe your current financial circumstances..."
                      {...register('financialInfo.currentFinancialSituation')}
                      rows={4}
                      className="mt-2"
                    />
                    {errors.financialInfo?.currentFinancialSituation && (
                      <p className="text-sm text-destructive mt-1">{errors.financialInfo.currentFinancialSituation.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="monthlyIncome">Approximate Monthly Income</Label>
                    <Select 
                      value={financialInfo.monthlyIncome} 
                      onValueChange={(value) => setValue('financialInfo.monthlyIncome', value)}
                    >
                      <SelectValue placeholder="Select income range"  />
                      <SelectContent>
                        <SelectItem value="0-500">€0 - €500</SelectItem>
                        <SelectItem value="500-1000">€500 - €1,000</SelectItem>
                        <SelectItem value="1000-1500">€1,000 - €1,500</SelectItem>
                        <SelectItem value="1500-2000">€1,500 - €2,000</SelectItem>
                        <SelectItem value="no-income">No income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="employmentStatus">Employment Status</Label>
                    <Select 
                      value={financialInfo.employmentStatus} 
                      onValueChange={(value) => setValue('financialInfo.employmentStatus', value)}
                    >
                      <SelectValue placeholder="Select your status"  />
                      <SelectContent>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="part-time">Part-time employed</SelectItem>
                        <SelectItem value="full-time-low">Full-time (low income)</SelectItem>
                        <SelectItem value="disabled">Unable to work (disability)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Mental Health History with AI */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Mental Health History
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI Assisted
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!showAIResults ? (
                    <>
                      <div>
                        <Label htmlFor="mentalHealthHistory">
                          Please share your mental health history *
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1 mb-2">
                          Include any diagnoses, symptoms, or challenges you're facing. Be as detailed as you feel comfortable.
                        </p>
                        <Textarea
                          id="mentalHealthHistory"
                          placeholder="e.g., I have been dealing with anxiety for 3 years, experiencing panic attacks, difficulty sleeping..."
                          {...register('mentalHealthHistory')}
                          rows={8}
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {mentalHealthHistory?.length || 0} characters (minimum 50 recommended for AI assistance)
                        </p>
                        {errors.mentalHealthHistory && (
                          <p className="text-sm text-destructive mt-1">{errors.mentalHealthHistory.message}</p>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAIRevision}
                        disabled={isAIProcessing || mentalHealthHistory.length < 50}
                        className="w-full"
                      >
                        {isAIProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            AI is analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Get AI Suggestions & Revision
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Tabs defaultValue="suggestions" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
                        <TabsTrigger value="revised">Revised Version</TabsTrigger>
                      </TabsList>
                      <TabsContent value="suggestions" className="space-y-3">
                        <Alert>
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription>
                            AI has analyzed your history. Here are some suggestions:
                          </AlertDescription>
                        </Alert>
                        {aiSuggestions.map((suggestion, index) => (
                          <Card key={index}>
                            <CardContent className="pt-4">
                              <p className="text-sm">{suggestion}</p>
                            </CardContent>
                          </Card>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAIResults(false)}
                          className="w-full"
                        >
                          Back to Edit
                        </Button>
                      </TabsContent>
                      <TabsContent value="revised" className="space-y-3">
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{aiRevisedHistory}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={handleUseAIVersion}
                            className="flex-1"
                          >
                            Use AI Version
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAIResults(false)}
                            className="flex-1"
                          >
                            Keep Original
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}

                  <div>
                    <Label htmlFor="previousTherapy">Previous Therapy Access</Label>
                    <Textarea
                      id="previousTherapy"
                      placeholder="Have you had therapy before? If yes, what prevented you from continuing?"
                      {...register('previousTherapyAccess')}
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Support Details */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Support Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="reasonForSupport">Why are you seeking donation support? *</Label>
                    <Textarea
                      id="reasonForSupport"
                      placeholder="Explain why you need financial assistance for therapy..."
                      {...register('reasonForSupport')}
                      rows={4}
                      className="mt-2"
                    />
                    {errors.reasonForSupport && (
                      <p className="text-sm text-destructive mt-1">{errors.reasonForSupport.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="supportNeeded">What level of support do you need? *</Label>
                    <Select value={supportNeeded} onValueChange={(value) => setValue('supportNeeded', value)}>
                      <SelectValue placeholder="Select support level"  />
                      <SelectContent>
                        <SelectItem value="full">Full coverage (100%)</SelectItem>
                        <SelectItem value="substantial">Substantial support (75%)</SelectItem>
                        <SelectItem value="partial">Partial support (50%)</SelectItem>
                        <SelectItem value="sliding">Sliding scale (25-50%)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.supportNeeded && (
                      <p className="text-sm text-destructive mt-1">{errors.supportNeeded.message}</p>
                    )}
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Next Steps:</strong> After submission, our team will review your application within 48 hours. 
                      You may be contacted for additional verification. Approved applicants will be matched with available donors.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <div className="flex gap-2 flex-1 sm:flex-initial">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              )}
            </div>
          </DialogFooter></form></DialogContent>
    </Dialog>
  );
}
