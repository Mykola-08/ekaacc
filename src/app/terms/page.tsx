import Link from 'next/link'
import { PolicyPageShell } from '@/components/layout/policy-page-shell'
import { Button } from '@/components/ui/button'

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString()

  return (
    <PolicyPageShell
      badgeText="Policies"
      title="Terms of Service"
      description="The rules, responsibilities, and commitments that keep EKA Account dependable for therapists and clients alike."
      lastUpdated={lastUpdated}
      actions={(
        <>
          <Button asChild size="lg">
            <Link href="/privacy">Review privacy policy</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/privacy-controls">Manage privacy controls</Link>
          </Button>
        </>
      )}
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the EKA Account platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Description of Service</h2>
          <p>
            EKA Account provides a comprehensive platform for therapy management, including booking, payments, and client management.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. User Account</h2>
          <p>
            You are responsible for maintaining the security of your account and password. The Service cannot and will not be liable for any loss or damage from your failure to comply with this
            security obligation.
          </p>
          <h3 className="text-xl font-semibold">OAuth Authentication</h3>
          <p>
            When you sign in using OAuth providers (such as Google, GitHub, etc.), you authorize us to access certain information from your account with that provider as permitted by that provider
            and authorized by you. You can revoke this authorization at any time through your account settings or the provider&apos;s settings. We will immediately cease accessing your data from that
            provider upon revocation.
          </p>
          <p>
            <strong>Google Account:</strong> If you connect your Google account, you grant us permission to access specific Google services (Calendar, Drive, Gmail) as you authorize. Our use of
            information received from Google APIs will adhere to
            <a className="underline" href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
              {' '}
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements. We will only request access to Google services that are necessary for features you choose to use.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. No Medical Advice</h2>
          <p>
            The Service, including any AI-generated insights, content, or communications, is provided for informational and educational purposes only and does not constitute medical,
            psychological, psychiatric, or other professional advice, diagnosis, or treatment. We do not provide healthcare services. Always seek the advice of a qualified health provider with any
            questions you may have regarding a medical condition. If you are experiencing an emergency, call your local emergency number immediately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Modifications to Service</h2>
          <p>
            We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. User Conduct and Acceptable Use</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Do not use the Service for illegal, harmful, or abusive activities.</li>
            <li>Do not upload or share content that infringes others&apos; rights or contains personal health information of others without consent.</li>
            <li>Do not attempt to reverse engineer, disrupt, or overload the Service.</li>
            <li>Do not use OAuth integrations to access data you don&apos;t have permission to access.</li>
            <li>Do not share, sell, or distribute data accessed through OAuth providers (including Google) in violation of their terms or applicable laws.</li>
            <li>Do not use Google user data (including Calendar, Drive, or Gmail data) for any purpose other than providing the features you explicitly requested.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. No Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING, WITHOUT LIMITATION, IMPLIED
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT
            CONTENT WILL BE ACCURATE OR RELIABLE.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR
            REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR
            USE THE SERVICE; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (C) ANY CONTENT OBTAINED FROM THE SERVICE; AND (D) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR
            TRANSMISSIONS OR CONTENT. OUR AGGREGATE LIABILITY SHALL NOT EXCEED THE GREATER OF THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM OR USD $100.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless EKA Account and its affiliates, officers, agents, employees, and partners from any claims, damages, obligations, losses, liabilities, costs or
            debt, and expenses (including but not limited to attorney&apos;s fees) arising from your use of the Service or violation of these Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Account Cancellation and Refunds</h2>
          <p>
            You may cancel your account at any time. Refunds (if applicable) will be provided according to our refund policy. Access to OAuth-connected services will be revoked upon cancellation,
            and associated tokens will be deleted.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Governing Law</h2>
          <p>These Terms shall be governed by the laws of the jurisdiction where EKA Account is registered, without regard to conflict of law principles.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Changes to Terms</h2>
          <p>
            We reserve the right to update or change these Terms at any time. Continued use of the Service after any changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">13. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at
            <a className="underline ml-1" href="mailto:support@ekabalance.com">
              support@ekabalance.com
            </a>
            .
          </p>
        </section>
      </div>
    </PolicyPageShell>
  )
}
