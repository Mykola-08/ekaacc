import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the EKA Account platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>
            EKA Account provides a comprehensive platform for therapy management, including booking, payments, and client management.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Account</h2>
          <p>
            You are responsible for maintaining the security of your account and password. The Service cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Privacy Policy</h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Modifications to Service</h2>
          <p>
            We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. General Conditions</h2>
          <p>
            Your use of the Service is at your sole risk. The service is provided on an "as is" and "as available" basis.
          </p>
        </section>
      </div>
    </div>
  );
}
