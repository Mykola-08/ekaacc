"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/platform/supabase';
import { Shield, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type RequestType = 'access' | 'deletion' | 'rectification' | 'portability' | 'restriction' | 'objection';

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
   const { error: insertError } = await supabase
    .from('data_requests')
    .insert([
     {
      email,
      request_type: requestType,
      details,
      status: 'pending'
     }
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
   <div className="max-w-2xl mx-auto py-16 px-4 text-center">
    <div className="bg-green-50 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
     <CheckCircle className="w-10 h-10 text-green-600" />
    </div>
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Submitted</h1>
    <p className="text-lg text-gray-600 mb-8">
     We have received your data request. Our Data Protection Officer will review it and respond to you at <strong>{email}</strong> within 30 days.
    </p>
    <button
     onClick={() => {
      setSubmitted(false);
      setEmail('');
      setDetails('');
      setRequestType('access');
     }}
     className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary hover:bg-primary/90 transition-colors"
    >
     Submit Another Request
    </button>
   </div>
  );
 }

 return (
  <div className="max-w-3xl mx-auto py-12 px-4">
   <div className="text-center mb-12">
    <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-xl mb-4">
     <Shield className="w-8 h-8 text-primary" />
    </div>
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Data Privacy Request</h1>
    <p className="text-lg text-gray-600">
     Exercise your rights under GDPR, CCPA, and other privacy laws. Use this form to request access, deletion, or correction of your personal data.
    </p>
   </div>

   <div className="bg-white shadow-sm border-none rounded-[32px] p-6 md:p-8">
    <form onSubmit={handleSubmit} className="space-y-6">
     {error && (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
       <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
       <p className="text-sm text-red-700">{error}</p>
      </div>
     )}

     <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
       Email Address
      </label>
      <input
       type="email"
       id="email"
       required
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
       placeholder="you@example.com"
      />
      <p className="mt-1 text-xs text-gray-500">
       We will use this email to verify your identity and communicate with you about your request.
      </p>
     </div>

     <div>
      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
       Request Type
      </label>
      <select
       id="type"
       value={requestType}
       onChange={(e) => setRequestType(e.target.value as RequestType)}
       className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
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
      <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
       Additional Details (Optional)
      </label>
      <textarea
       id="details"
       rows={4}
       value={details}
       onChange={(e) => setDetails(e.target.value)}
       className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
       placeholder="Please provide any specific details that will help us locate your data or understand your request..."
      />
     </div>

     <div className="pt-4 border-t">
      <button
       type="submit"
       disabled={isSubmitting}
       className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
       {isSubmitting ? (
        <>
         <Loader2 className="w-5 h-5 animate-spin" />
         Submitting...
        </>
       ) : (
        <>
         <Send className="w-5 h-5" />
         Submit Request
        </>
       )}
      </button>
      <p className="mt-4 text-xs text-center text-gray-500">
       By submitting this form, you confirm that you are the owner of the email address provided. We may request additional information to verify your identity before processing your request.
      </p>
     </div>
    </form>
   </div>
  </div>
 );
}
