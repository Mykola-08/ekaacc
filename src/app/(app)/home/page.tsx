'use client';

import PremiumHero from '@/components/PremiumHero';
import PremiumFeatures from '@/components/PremiumFeatures';
import { useAuth } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PremiumHomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-12 w-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <PremiumHero />
      <PremiumFeatures />
      
      {/* Additional Premium Sections */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Ready to Transform Your Life?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join thousands of users who have already started their journey towards better mental health and personal growth.
            </p>
            <div className="mt-10">
              <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Begin Your Transformation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}