'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/platform/supabase';
import { Shield, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type RequestType =
  | 'access'
  | 'deletion'
  | 'rectification'
  | 'portability'
  | 'restriction'
  | 'objection';

export default function DataRequestPage() {
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState<RequestType>('access');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const supabase = createClient(); // Used imported instance

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('data_requests').insert([
        {
          email,
          request_type: requestType,
          details,
          status: 'pending',
        },
      ]);

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting request:', err);
      setError(err.message || 'An error occurred while submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 p-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-foreground mb-4 text-3xl font-bold">Request Submitted</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          We have received your data request. Our Data Protection Officer will review it and respond
          to you at <strong>{email}</strong> within 30 days.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setEmail('');
            setDetails('');
            setRequestType('access');
          }}
          className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-xl border border-transparent px-6 py-3 text-base font-medium text-primary-foreground transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-blue-50 p-3">
          <Shield className="text-primary h-8 w-8" />
        </div>
        <h1 className="text-foreground mb-4 text-3xl font-bold">Data Privacy Request</h1>
        <p className="text-muted-foreground text-lg">
          Exercise your rights under GDPR, CCPA, and other privacy laws. Use this form to request
          access, deletion, or correction of your personal data.
        </p>
      </div>

      <div className="bg-card rounded-2xl border-none p-6 shadow-sm md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-foreground/90 mb-1 block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-2 transition-all outline-none focus:ring-2"
              placeholder="you@example.com"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              We will use this email to verify your identity and communicate with you about your
              request.
            </p>
          </div>

          <div>
            <label htmlFor="type" className="text-foreground/90 mb-1 block text-sm font-medium">
              Request Type
            </label>
            <select
              id="type"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as RequestType)}
              className="border-border focus:ring-primary focus:border-primary bg-card w-full rounded-xl border px-4 py-2 transition-all outline-none focus:ring-2"
            >
              <option value="access">Access (Right to Know)</option>
              <option value="deletion">Deletion (Right to be Forgotten)</option>
              <option value="rectification">Correction (Rectification)</option>
              <option value="portability">Data Portability</option>
              <option value="restriction">Restriction of Processing</option>
              <option value="objection">Objection to Processing</option>
            </select>
          </div>

          <div>
            <label htmlFor="details" className="text-foreground/90 mb-1 block text-sm font-medium">
              Additional Details (Optional)
            </label>
            <textarea
              id="details"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="border-border focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-2 transition-all outline-none focus:ring-2"
              placeholder="Please provide any specific details that will help us locate your data or understand your request..."
            />
          </div>

          <div className="border-t pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 focus:ring-primary flex w-full items-center justify-center gap-2 rounded-xl border border-transparent px-6 py-3 text-base font-medium text-primary-foreground transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Request
                </>
              )}
            </button>
            <p className="text-muted-foreground mt-4 text-center text-xs">
              By submitting this form, you confirm that you are the owner of the email address
              provided. We may request additional information to verify your identity before
              processing your request.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
