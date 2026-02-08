import React from 'react';
import { FileText, Database, Lock, Globe, Users, Clock } from 'lucide-react';

export default function RoPAPage() {
 return (
  <div className="max-w-4xl mx-auto py-12 px-4">
   <div className="mb-12">
    <h1 className="text-3xl font-bold text-foreground mb-4">Record of Processing Activities (RoPA)</h1>
    <p className="text-lg text-muted-foreground">
     In compliance with Article 30 of the GDPR, EKA Balance maintains a record of processing activities. This summary outlines how we handle data across our organization.
    </p>
   </div>

   <div className="space-y-8">
    {/* Activity 1: User Account Management */}
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
     <div className="bg-muted/30 px-6 py-4 border-b flex items-center gap-3">
      <Users className="w-5 h-5 text-primary" />
      <h3 className="font-semibold text-foreground">1. User Account Management</h3>
     </div>
     <div className="p-6 grid md:grid-cols-2 gap-6">
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Purpose of Processing</h4>
       <p className="text-sm text-foreground">To create and manage user accounts, authenticate users, and provide access to the platform.</p>
      </div>
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Categories of Data</h4>
       <p className="text-sm text-foreground">Name, Email, Password (hashed), IP Address, Login History.</p>
      </div>
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Legal Basis</h4>
       <p className="text-sm text-foreground">Contractual Necessity (Art. 6(1)(b) GDPR)</p>
      </div>
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Retention Period</h4>
       <p className="text-sm text-foreground">Duration of account + 30 days after deletion.</p>
      </div>
     </div>
    </div>

    {/* Activity 2: Therapy Services */}
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
     <div className="bg-muted/30 px-6 py-4 border-b flex items-center gap-3">
      <Database className="w-5 h-5 text-primary" />
      <h3 className="font-semibold text-foreground">2. Therapy & Consultation Services</h3>
     </div>
     <div className="p-6 grid md:grid-cols-2 gap-6">
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Purpose of Processing</h4>
       <p className="text-sm text-foreground">To provide mental health services, schedule appointments, and maintain medical records.</p>
      </div>
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Categories of Data</h4>
       <p className="text-sm text-foreground">Health Data (Special Category), Session Notes, Appointment History.</p>
      </div>
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Legal Basis</h4>
       <p className="text-sm text-foreground">Explicit Consent (Art. 9(2)(a) GDPR) & Provision of Health Care (Art. 9(2)(h) GDPR)</p>
      </div>
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Retention Period</h4>
       <p className="text-sm text-foreground">5 years after last interaction (or as required by local medical laws).</p>
      </div>
     </div>
    </div>

    {/* Activity 3: Payment Processing */}
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
     <div className="bg-muted/30 px-6 py-4 border-b flex items-center gap-3">
      <Lock className="w-5 h-5 text-primary" />
      <h3 className="font-semibold text-foreground">3. Payment Processing</h3>
     </div>
     <div className="p-6 grid md:grid-cols-2 gap-6">
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Purpose of Processing</h4>
       <p className="text-sm text-foreground">To process payments for services and subscriptions.</p>
      </div>
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Categories of Data</h4>
       <p className="text-sm text-foreground">Billing Address, Transaction ID, Last 4 digits of card (processed by Stripe).</p>
      </div>
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Legal Basis</h4>
       <p className="text-sm text-foreground">Contractual Necessity (Art. 6(1)(b) GDPR) & Legal Obligation (Tax laws).</p>
      </div>
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Retention Period</h4>
       <p className="text-sm text-foreground">10 years (for tax and accounting purposes).</p>
      </div>
     </div>
    </div>

    {/* Activity 4: Marketing & Analytics */}
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
     <div className="bg-muted/30 px-6 py-4 border-b flex items-center gap-3">
      <Globe className="w-5 h-5 text-primary" />
      <h3 className="font-semibold text-foreground">4. Marketing & Analytics</h3>
     </div>
     <div className="p-6 grid md:grid-cols-2 gap-6">
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Purpose of Processing</h4>
       <p className="text-sm text-foreground">To send newsletters, analyze website usage, and improve services.</p>
      </div>
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Categories of Data</h4>
       <p className="text-sm text-foreground">Email, Cookie Data, Usage Metrics.</p>
      </div>
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Legal Basis</h4>
       <p className="text-sm text-foreground">Consent (Art. 6(1)(a) GDPR) - Withdrawable at any time.</p>
      </div>
      <div>
       <h4 className="text-sm font-medium text-muted-foreground mb-1">Retention Period</h4>
       <p className="text-sm text-foreground">Until consent is withdrawn.</p>
      </div>
     </div>
    </div>
   </div>

   <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
    <div className="flex items-start gap-4">
     <FileText className="w-6 h-6 text-blue-600 mt-1" />
     <div>
      <h3 className="font-semibold text-blue-900 mb-2">Data Transfers</h3>
      <p className="text-sm text-blue-800">
       We may transfer data to service providers outside the EEA (e.g., USA). All such transfers are protected by Standard Contractual Clauses (SCCs) and Data Processing Agreements (DPAs) to ensure an adequate level of protection.
      </p>
     </div>
    </div>
   </div>
  </div>
 );
}

