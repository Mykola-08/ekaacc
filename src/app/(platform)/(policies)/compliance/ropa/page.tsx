import React from 'react';
import { FileText, Database, Lock, Globe, Users, Clock } from 'lucide-react';

export default function RoPAPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12">
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          Record of Processing Activities (RoPA)
        </h1>
        <p className="text-muted-foreground text-lg">
          In compliance with Article 30 of the GDPR, EKA Balance maintains a record of processing
          activities. This summary outlines how we handle data across our organization.
        </p>
      </div>

      <div className="space-y-8">
        {/* Activity 1: User Account Management */}
        <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="bg-muted/30 flex items-center gap-3 border-b px-6 py-4">
            <Users className="text-primary h-5 w-5" />
            <h3 className="text-foreground font-semibold">1. User Account Management</h3>
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                Purpose of Processing
              </h4>
              <p className="text-foreground text-sm">
                To create and manage user accounts, authenticate users, and provide access to the
                platform.
              </p>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">Categories of Data</h4>
              <p className="text-foreground text-sm">
                Name, Email, Password (hashed), IP Address, Login History.
              </p>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">Legal Basis</h4>
              <p className="text-foreground text-sm">Contractual Necessity (Art. 6(1)(b) GDPR)</p>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">Retention Period</h4>
              <p className="text-foreground text-sm">
                Duration of account + 30 days after deletion.
              </p>
            </div>
          </div>
        </div>

        {/* Activity 2: Therapy Services */}
        <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="bg-muted/30 flex items-center gap-3 border-b px-6 py-4">
            <Database className="text-primary h-5 w-5" />
            <h3 className="text-foreground font-semibold">2. Therapy & Consultation Services</h3>
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                Purpose of Processing
              </h4>
              <p className="text-foreground text-sm">
                To provide mental health services, schedule appointments, and maintain medical
                records.
              </p>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">Categories of Data</h4>
              <p className="text-foreground text-sm">
                Health Data (Special Category), Session Notes, Appointment History.
              </p>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">Legal Basis</h4>
              <p className="text-foreground text-sm">
                Explicit Consent (Art. 9(2)(a) GDPR) & Provision of Health Care (Art. 9(2)(h) GDPR)
              </p>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">Retention Period</h4>
              <p className="text-foreground text-sm">
                5 years after last interaction (or as required by local medical laws).
              </p>
            </div>
          </div>
        </div>

        {/* Activity 3: Payment Processing */}
        <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="bg-muted/30 flex items-center gap-3 border-b px-6 py-4">
            <Lock className="text-primary h-5 w-5" />
            <h3 className="text-foreground font-semibold">3. Payment Processing</h3>
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                Purpose of Processing
              </h4>
              <p className="text-foreground text-sm">
                To process payments for services and subscriptions.
              </p>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">Categories of Data</h4>
              <p className="text-foreground text-sm">
                Billing Address, Transaction ID, Last 4 digits of card (processed by Stripe).
              </p>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">Legal Basis</h4>
              <p className="text-foreground text-sm">
                Contractual Necessity (Art. 6(1)(b) GDPR) & Legal Obligation (Tax laws).
              </p>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">Retention Period</h4>
              <p className="text-foreground text-sm">10 years (for tax and accounting purposes).</p>
            </div>
          </div>
        </div>

        {/* Activity 4: Marketing & Analytics */}
        <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="bg-muted/30 flex items-center gap-3 border-b px-6 py-4">
            <Globe className="text-primary h-5 w-5" />
            <h3 className="text-foreground font-semibold">4. Marketing & Analytics</h3>
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                Purpose of Processing
              </h4>
              <p className="text-foreground text-sm">
                To send newsletters, analyze website usage, and improve services.
              </p>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">Categories of Data</h4>
              <p className="text-foreground text-sm">Email, Cookie Data, Usage Metrics.</p>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">Legal Basis</h4>
              <p className="text-foreground text-sm">
                Consent (Art. 6(1)(a) GDPR) - Withdrawable at any time.
              </p>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-1 text-sm font-medium">Retention Period</h4>
              <p className="text-foreground text-sm">Until consent is withdrawn.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-xl border border-blue-100 bg-blue-50 p-6">
        <div className="flex items-start gap-4">
          <FileText className="mt-1 h-6 w-6 text-blue-600" />
          <div>
            <h3 className="mb-2 font-semibold text-blue-900">Data Transfers</h3>
            <p className="text-sm text-blue-800">
              We may transfer data to service providers outside the EEA (e.g., USA). All such
              transfers are protected by Standard Contractual Clauses (SCCs) and Data Processing
              Agreements (DPAs) to ensure an adequate level of protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
