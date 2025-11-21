import Link from 'next/link'
import { PolicyPageShell } from '@/components/layout/policy-page-shell'
import { Button } from '@/components/ui/button'

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString()

  return (
    <PolicyPageShell
      badgeText="Trust & Safety"
      title="Privacy Policy"
      description="How we protect your information, respect your choices, and keep your data safe across the EKA experience."
      lastUpdated={lastUpdated}
      actions={(
        <>
          <Button asChild size="lg">
            <Link href="/privacy-controls">Manage privacy controls</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/cookies">View cookies policy</Link>
          </Button>
        </>
      )}
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Account Data:</strong> name, email, profile details, authentication identifiers.</li>
            <li>
              <strong>OAuth Authentication Data:</strong> When you sign in with Google or other OAuth providers, we receive your
              basic profile information (name, email, profile picture) and OAuth tokens to maintain your authenticated session.
            </li>
            <li>
              <strong>Google API Data:</strong> If you grant us permission to access your Google services (Calendar, Drive, Gmail), we may
              access and store limited data from these services solely to provide features you request. This data is used in accordance with
              <a className="underline" href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
                {' '}
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </li>
            <li><strong>Transactional Data:</strong> subscription status, invoices, and limited payment metadata (payment processing handled by third parties).</li>
            <li><strong>Usage Data:</strong> app interactions, device information, IP address, logs, and diagnostic data.</li>
            <li><strong>Content You Provide:</strong> entries, messages, files you upload, and preference settings.</li>
            <li><strong>AI-Related Data:</strong> prompts and outputs when interacting with AI features.</li>
            <li>
              <strong>Cookies &amp; Similar Tech:</strong> see our <Link className="underline" href="/cookies">Cookies Policy</Link>.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Provide, secure, and maintain the Service.</li>
            <li>Authenticate your account and maintain your login session.</li>
            <li>Access Google services (Calendar, Drive, Gmail) only when you explicitly grant permission and only to provide features you request.</li>
            <li>Process payments and manage subscriptions.</li>
            <li>Personalize experiences and provide AI-powered features.</li>
            <li>Communicate service updates and respond to support requests.</li>
            <li>Analyze usage to improve performance and reliability.</li>
            <li>Comply with legal obligations and enforce terms.</li>
          </ul>
          <p>
            <strong>Google API Services User Data:</strong> Our use of information received from Google APIs adheres to the
            <a
              className="underline"
              href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements. We will only use access to read, write, modify, or control Gmail message bodies (including attachments),
            metadata, headers, and settings to provide features explicitly requested by you and will not transfer this Gmail data to others unless doing so is
            necessary to provide and improve these features, comply with applicable law, or as part of a merger, acquisition, or sale of assets with notice to
            you.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Information Sharing</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Service Providers:</strong> hosting, analytics, support, payment processing, and AI vendors under contracts and confidentiality.
            </li>
            <li>
              <strong>Google User Data:</strong> We do not share, sell, or use Google user data (including data from Gmail, Calendar, or Drive APIs) for serving
              advertisements. Data accessed through Google APIs is only used to provide or improve user-facing features that are visible in the Service&apos;s user
              interface and is never transferred to third parties except as necessary to provide the Service, comply with applicable law, or as part of a merger,
              acquisition, or sale of assets with notice to you.
            </li>
            <li>
              <strong>Legal Compliance:</strong> to comply with law, regulation, legal process, or government request.
            </li>
            <li>
              <strong>Business Transfers:</strong> in connection with a merger, acquisition, financing, or sale of assets.
            </li>
            <li>
              <strong>With Your Consent:</strong> or at your direction.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Data Security</h2>
          <p>
            We implement administrative, technical, and organizational measures designed to protect your information (e.g., encryption in transit and at rest where applicable,
            access controls, logging). OAuth tokens from Google and other providers are encrypted and stored securely with row-level security policies ensuring you can only access your own tokens.
            We follow industry best practices for token management and automatically refresh expired tokens to maintain security. No system is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Your Rights</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Access, correct, or delete your personal information.</li>
            <li>
              Revoke access to your Google account and connected services at any time through your account settings or{' '}
              <Link className="underline" href="/privacy-controls">Privacy Controls</Link>.
            </li>
            <li>View which OAuth providers are connected to your account and disconnect them.</li>
            <li>Object to or restrict certain processing.</li>
            <li>Data portability where applicable.</li>
            <li>Withdraw consent where processing is based on consent.</li>
          </ul>
          <p>
            Manage preferences at <Link className="underline" href="/privacy-controls">Privacy Controls</Link> or contact us as below. When you disconnect an OAuth provider,
            we immediately delete all stored tokens and cease accessing that service on your behalf.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. International Transfers</h2>
          <p>
            We may process data in countries other than your own. Where required, we use appropriate safeguards (such as Standard Contractual Clauses) to protect personal data
            transferred internationally.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Data Retention</h2>
          <p>
            We retain personal data for as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce agreements. You can view and adjust certain
            retention-related settings in <Link className="underline" href="/privacy-controls">Privacy Controls</Link>.
          </p>
          <p>
            <strong>OAuth Tokens:</strong> Access tokens and refresh tokens from Google and other OAuth providers are retained only while you maintain an active connection to that service.
            When you disconnect an OAuth provider or delete your account, all associated tokens are immediately and permanently deleted from our systems.
          </p>
          <p>
            <strong>Google API Data:</strong> Data accessed from Google services (Calendar, Drive, Gmail) is retained only as long as necessary to provide the features you requested. You can
            request deletion of this data at any time through your account settings or by contacting us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Children’s Privacy</h2>
          <p>
            The Service is not directed to children under the age of 13 (or the age required by applicable law). We do not knowingly collect personal data from children. If you believe a child
            has provided us personal data, contact us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Changes to this Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will post updates on this page with a revised “Last updated” date. Your continued use constitutes acceptance.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Contact Us</h2>
          <p>
            Questions or requests? Contact <a className="underline" href="mailto:support@ekabalance.com">support@ekabalance.com</a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10a. Google OAuth and API Services</h2>
          <p>
            When you sign in with Google or grant us access to your Google services, we access and use your Google user data in accordance with{' '}
            <a className="underline" href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
              Google API Services User Data Policy
            </a>
            , including the{' '}
            <a
              className="underline"
              href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
              target="_blank"
              rel="noopener noreferrer"
            >
              Limited Use requirements
            </a>
            .
          </p>

          <h3 className="text-xl font-semibold">What We Access</h3>
          <p>Depending on the permissions you grant, we may access:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Basic Profile Information:</strong> Your name, email address, and profile picture for authentication and account creation.
            </li>
            <li>
              <strong>Google Calendar:</strong> Read and write access to your calendar events to help you schedule and manage appointments.
            </li>
            <li>
              <strong>Google Drive:</strong> Read access to files you choose to share with the Service.
            </li>
            <li>
              <strong>Gmail:</strong> Read access to messages and metadata to provide email-related features you request.
            </li>
          </ul>

          <h3 className="text-xl font-semibold">How We Use Google Data</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>We use Google user data only to provide, improve, and develop user-facing features visible in our Service.</li>
            <li>We do not use Google user data for serving advertisements.</li>
            <li>
              We do not allow humans to read your Google data unless: (a) you give explicit consent, (b) it&apos;s necessary for security purposes, or (c) it&apos;s required to comply with applicable law.
            </li>
            <li>All use of Google user data complies with Google&apos;s Limited Use requirements, which prohibit using the data for any purpose other than providing or improving user-facing features.</li>
          </ul>

          <h3 className="text-xl font-semibold">Data Transfer and Sharing</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              We do not transfer Google user data to third parties except as necessary to provide user-facing features, comply with applicable law, or as part of a merger or acquisition (with notice to you).
            </li>
            <li>We do not sell Google user data.</li>
            <li>
              Any third-party service providers that may process Google user data are contractually bound to handle the data securely and only for the purposes we specify.
            </li>
          </ul>

          <h3 className="text-xl font-semibold">Your Control</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              You can revoke our access to your Google account at any time through your{' '}
              <Link className="underline" href="/privacy-controls">Privacy Controls</Link> or your
              <a className="underline" href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
                {' '}
                Google Account permissions page
              </a>
              .
            </li>
            <li>When you revoke access, we immediately stop accessing your Google data and delete all stored OAuth tokens.</li>
            <li>
              You can request deletion of any data we&apos;ve already collected from Google by contacting us at{' '}
              <a className="underline" href="mailto:support@ekabalance.com">support@ekabalance.com</a>.
            </li>
          </ul>

          <h3 className="text-xl font-semibold">Security Measures</h3>
          <p>We implement industry-standard security measures to protect your Google OAuth tokens and data, including:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Encryption of tokens in transit (TLS/SSL) and at rest</li>
            <li>Row-level security policies ensuring users can only access their own tokens</li>
            <li>Automatic token refresh to maintain security</li>
            <li>Secure server-side token refresh endpoints that never expose client secrets</li>
            <li>Regular security audits and monitoring</li>
          </ul>
        </section>
      </div>
    </PolicyPageShell>
  )
}
