'use client';

import { CheckCircle2, Sparkles, Target, Calendar, MessageCircle } from 'lucide-react';

interface FinalStepProps {
  formData: any;
}

export function FinalStep({ formData }: FinalStepProps) {
  return (
    <div className="text-center space-y-6 max-w-md mx-auto">
      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center animate-pulse">
        <CheckCircle2 className="w-12 h-12 text-white" />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          You're All Set!
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          We've created your personalized wellness journey
        </p>
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-xl p-6 space-y-3 text-sm text-left shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Your Goals
          </span>
          <span className="font-semibold">{formData.goals?.length || 1} focus areas</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Session Type
          </span>
          <span className="font-semibold capitalize">{formData.preferredSessionType || 'Virtual'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Communication
          </span>
          <span className="font-semibold capitalize">{formData.communicationStyle || 'Supportive'}</span>
        </div>
      </div>
      <div className="bg-indigo-50 dark:bg-indigo-950 rounded-lg p-4 text-sm border-2 border-indigo-200 dark:border-indigo-800">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <div className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
              🎁 Welcome Gift
            </div>
            <div className="text-indigo-700 dark:text-indigo-300">
              Start your journey with a complimentary wellness assessment worth €50
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
