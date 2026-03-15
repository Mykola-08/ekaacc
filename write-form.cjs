const fs = require('fs');

const content = `'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const onboardingSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  goals: z.string().min(10, 'Please tell us a bit more about your goals'),
  preferredContact: z.enum(['email', 'telegram', 'whatsapp']),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function PersonalizedOnboarding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: '',
      goals: '',
      preferredContact: 'email',
    },
  });

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsSubmitting(true);
    try {
      // Future integration: Save to Supabase b2b_leads or users table via Server Action
      console.log('Saved onboarding profile data:', data);
      await new Promise(resolve => setTimeout(resolve, 800)); // Mock network delay
      setSuccess(true);
    } catch (error) {
      console.error('Failed to save onboarding', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={cn("mx-auto max-w-lg p-8 text-center rounded-2xl bg-green-50 animate-in fade-in zoom-in duration-500")}>
        <h2 className="text-2xl font-bold text-green-900 mb-4">You're All Set!</h2>
        <p className="text-green-700">
          Thank you for completing your specific onboarding profile. Our team or your AI companion will use this to guide your journey.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto max-w-lg p-6 bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300")}>
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Personalize Your Experience</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            {...register('fullName')}
            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Jane Doe"
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">What are your main goals?</label>
          <textarea
            {...register('goals')}
            rows={4}
            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="I want to improve my stress handling..."
          />
          {errors.goals && <p className="text-sm text-red-500">{errors.goals.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Preferred Contact Method</label>
          <select
            {...register('preferredContact')}
            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
          >
            <option value="email">Email</option>
            <option value="telegram">Telegram</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          {errors.preferredContact && <p className="text-sm text-red-500">{errors.preferredContact.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl py-3"
        >
          {isSubmitting ? 'Saving Profile...' : 'Complete Onboarding'}
        </Button>
      </form>
    </div>
  );
}`;

fs.writeFileSync('src/marketing/components/PersonalizedOnboarding.tsx', content);
console.log('Overwritten successfully');
