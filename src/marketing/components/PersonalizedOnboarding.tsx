'use client';

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
      await new Promise((resolve) => setTimeout(resolve, 800)); // Mock network delay
      setSuccess(true);
    } catch (error) {
      console.error('Failed to save onboarding', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        className={cn(
          'animate-in fade-in zoom-in mx-auto max-w-lg rounded-[var(--radius)] bg-green-50 p-8 text-center duration-500'
        )}
      >
        <h2 className="mb-4 text-2xl font-bold text-green-900">You're All Set!</h2>
        <p className="text-green-700">
          Thank you for completing your specific onboarding profile. Our team or your AI companion
          will use this to guide your journey.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'animate-in fade-in mx-auto max-w-lg rounded-[var(--radius)] border border-gray-100 bg-white p-6 duration-300'
      )}
    >
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">Personalize Your Experience</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            {...register('fullName')}
            className="focus:border-primary focus:ring-primary w-full rounded-[calc(var(--radius)*0.8)] border border-gray-300 p-2.5 outline-none focus:ring-1"
            placeholder="Jane Doe"
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">What are your main goals?</label>
          <textarea
            {...register('goals')}
            rows={4}
            className="focus:border-primary focus:ring-primary w-full rounded-[calc(var(--radius)*0.8)] border border-gray-300 p-2.5 outline-none focus:ring-1"
            placeholder="I want to improve my stress handling..."
          />
          {errors.goals && <p className="text-sm text-red-500">{errors.goals.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Preferred Contact Method</label>
          <select
            {...register('preferredContact')}
            className="focus:border-primary focus:ring-primary w-full rounded-[calc(var(--radius)*0.8)] border border-gray-300 bg-white p-2.5 outline-none focus:ring-1"
          >
            <option value="email">Email</option>
            <option value="telegram">Telegram</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          {errors.preferredContact && (
            <p className="text-sm text-red-500">{errors.preferredContact.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[var(--radius)] py-3"
        >
          {isSubmitting ? 'Saving Profile...' : 'Complete Onboarding'}
        </Button>
      </form>
    </div>
  );
}
