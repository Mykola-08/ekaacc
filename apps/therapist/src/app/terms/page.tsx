import React from 'react';
import Link from 'next/link';

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
          <h3 className="text-xl font-semibold mt-4 mb-2">OAuth Authentication</h3>
          <p>
            When you sign in using OAuth providers (such as Google, GitHub, etc.), you authorize us to access certain information from your account with that provider as permitted by that provider and authorized by you. You can revoke this authorization at any time through your account settings or the provider's settings. We will immediately cease accessing your data from that provider upon revocation.
          </p>
          <p className="mt-3">
            <strong>Google Account:</strong> If you connect your Google account, you grant us permission to access specific Google services (Calendar, Drive, Gmail) as you authorize. Our use of information received from Google APIs will adhere to <a className="underline" href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements. We will only request access to Google services that are necessary for features you choose to use.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. No Medical Advice</h2>
          <p>
            The Service, including any AI-generated insights, content, or communications, is provided for informational and educational purposes only and does not constitute medical, psychological, psychiatric, or other professional advice, diagnosis, or treatment. We do not provide healthcare services. Always seek the advice of a qualified health provider with any questions you may have regarding a medical condition. If you are experiencing an emergency, call your local emergency number immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Modifications to Service</h2>
          <p>
            We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. User Conduct and Acceptable Use</h2>
          <ul>
            <li>Do not use the Service for illegal, harmful, or abusive activities.</li>
            <li>Do not upload or share content that infringes others' rights or contains personal health information of others without consent.</li>
            <li>Do not attempt to reverse engineer, disrupt, or overload the Service.</li>
            <li>Do not use OAuth integrations to access data you don't have permission to access.</li>
            <li>Do not share, sell, or distribute data accessed through OAuth providers (including Google) in violation of their terms or applicable laws.</li>
            <li>Do not use Google user data (including Calendar, Drive, or Gmail data) for any purpose other than providing the features you explicitly requested.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. No Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT CONTENT WILL BE ACCURATE OR RELIABLE.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (C) ANY CONTENT OBTAINED FROM THE SERVICE; AND (D) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT. OUR AGGREGATE LIABILITY SHALL NOT EXCEED THE GREATER OF THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM OR USD $100.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless us and our affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorney’s fees, arising out of or in any way connected with your use of the Service or violation of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Third-Party Services</h2>
          <p>
            The Service may integrate with third-party services (e.g., payment processors, analytics, AI providers, OAuth providers like Google). We are not responsible for such third parties or their practices. Your use of third-party services is governed by their terms and privacy policies.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">Google Services Integration</h3>
          <p>
            If you choose to connect your Google account or use Google services through our platform:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>You agree to Google's <a className="underline" href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
            <li>Our access to your Google data is limited to the scopes you explicitly authorize.</li>
            <li>You can revoke our access at any time through your <Link className="underline" href="/privacy-controls">Privacy Controls</Link> or <a className="underline" href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">Google Account settings</a>.</li>
            <li>We use Google data only to provide features you request and in accordance with our <Link className="underline" href="/privacy">Privacy Policy</Link> and <a className="underline" href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google's API Services User Data Policy</a>.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Privacy and Cookies</h2>
          <p>
            Your use of the Service is governed by our <Link className="underline" href="/privacy">Privacy Policy</Link> and <Link className="underline" href="/cookies">Cookies Policy</Link>. Please review them to understand our practices and your choices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will post the updated Terms on this page with a revised “Last updated” date. Your continued use constitutes acceptance of the changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Contact</h2>
          <p>
            Questions about these Terms? Contact us at <a className="underline" href="mailto:support@ekabalance.com">support@ekabalance.com</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Healthcare & HIPAA</h2>
          <p>
            We do not provide medical or clinical services and are not a covered entity under HIPAA. If you are a covered entity or
            otherwise require HIPAA compliance for handling Protected Health Information (PHI), you must enter into a Business Associate
            Agreement (BAA) with us before using the Service for PHI. Absent a signed BAA, you agree not to upload or process PHI in the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14a. OAuth Integrations and Data Access</h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">Authorization and Permissions</h3>
          <p>
            When you connect third-party services (such as Google, GitHub, or other OAuth providers) to your account, you authorize us to access and use certain data from those services on your behalf. The specific data we access depends on the permissions (scopes) you grant during the authorization process.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Scope of Access</h3>
          <p>
            We will only request access to the minimum necessary scopes required to provide the features you choose to use. For example:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li><strong>Basic Authentication:</strong> Access to your name, email, and profile picture to create and maintain your account.</li>
            <li><strong>Google Calendar:</strong> Access to read and create calendar events only if you choose to use calendar integration features.</li>
            <li><strong>Google Drive:</strong> Access to read files you explicitly share through the Service.</li>
            <li><strong>Gmail:</strong> Access to read messages and metadata only for features you enable.</li>
          </ul>
          <p className="mt-3">
            We will never request access to scopes we don't need for Service functionality.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Data Usage Restrictions</h3>
          <p>
            For data accessed through OAuth providers, especially Google:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>We will use the data only to provide and improve user-facing features you request.</li>
            <li>We will not use the data to serve advertisements.</li>
            <li>We will not sell or share the data with third parties except as necessary to provide the Service or as required by law.</li>
            <li>We will not allow humans to read the data unless you give explicit consent, it's necessary for security, or required by law.</li>
            <li>We comply with all provider-specific policies, including Google's API Services User Data Policy and Limited Use requirements.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Your Rights</h3>
          <p>
            You may, at any time:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Revoke our access to any connected OAuth provider through your <Link className="underline" href="/privacy-controls">Privacy Controls</Link> or the provider's account settings.</li>
            <li>Request deletion of data we've obtained from OAuth providers.</li>
            <li>View which OAuth providers are connected to your account.</li>
            <li>See what permissions (scopes) you've granted.</li>
          </ul>
          <p className="mt-3">
            When you revoke access, we immediately stop accessing data from that provider and delete all stored OAuth tokens. Any data previously obtained may be retained according to our data retention policies unless you request deletion.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Security</h3>
          <p>
            We implement industry-standard security measures to protect OAuth tokens and data accessed through OAuth providers, including encryption in transit and at rest, access controls, and regular security audits. However, we cannot guarantee absolute security, and you use OAuth integrations at your own risk.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Provider Terms</h3>
          <p>
            Your use of OAuth integrations is also subject to the terms and policies of the respective providers:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li><strong>Google:</strong> <a className="underline" href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>, <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>, <a className="underline" href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">API Services User Data Policy</a></li>
            <li>Other providers' terms apply as applicable</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. GDPR/EU Users</h2>
          <p>
            If you are located in the EEA/UK, additional rights and obligations may apply under the GDPR. See our <Link className="underline" href="/privacy">Privacy Policy</Link> for information about lawful bases of processing,
            your data protection rights, and how to contact us.
          </p>
        </section>
      </div>
    </div>
  );
}
