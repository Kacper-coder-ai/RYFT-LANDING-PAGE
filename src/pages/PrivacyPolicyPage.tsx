import { LegalDocumentLayout } from '../components/LegalDocumentLayout'

export function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout title="Privacy Policy" lastUpdated="April 19, 2026">
      <p>
        This Privacy Policy explains how RYFT LLC (&ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and discloses
        your information when you use our website, applications, and related
        services (collectively, the &ldquo;Service&rdquo;).
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">1. Who We Are</h2>
        <p>
          RYFT LLC operates this Service. If you have any questions or concerns
          about this policy or your data, you can reach us directly at:
        </p>
        <ul className="list-inside list-disc space-y-2 text-gray-400">
          <li>
            <span className="text-gray-300">Contact Email:</span>{' '}
            <a
              href="mailto:support@ryft.us"
              className="text-primary underline-offset-2 hover:underline"
            >
              support@ryft.us
            </a>
          </li>
          <li>
            <span className="text-gray-300">Business Address:</span>{' '}
            <span className="text-gray-300">
            102 N MAIN STREET
            MOUNT PROSPECT,IL 60056
            </span>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">2. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, as well as data
          gathered automatically when you interact with our Service.
        </p>
        <ul className="list-inside list-disc space-y-3 text-gray-400">
          <li>
            <span className="text-gray-300">Account &amp; Profile Data:</span> If
            you create an account or sign in via an authentication provider
            (e.g., Google), we and our authentication provider (Supabase) process
            identifiers such as your email address, name, and profile image.
          </li>
          <li>
            <span className="text-gray-300">Waitlist &amp; Communications:</span>{' '}
            If you submit a form to express interest, subscribe to updates, or
            join a waitlist, we collect the contact information you provide.
          </li>
          <li>
            <span className="text-gray-300">Technical &amp; Usage Data:</span>{' '}
            Like most online services, we automatically collect certain technical
            information. This includes your IP address, device/browser type,
            operating system, and general usage data (such as clicks, page views,
            and errors). We use tools like Cloudflare and PostHog to capture and
            analyze this data to improve our Service.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">
          3. Payment Processing &amp; Billing
        </h2>
        <p>
          We use Paddle as our Merchant of Record for all orders and subscription
          processing.
        </p>
        <p>
          Paddle is responsible for the processing of all financial transactions
          and handles all related billing inquiries. When you make a purchase,
          you are completing a transaction with Paddle. Paddle will collect,
          process, and securely store your payment information (such as credit
          card details and billing address) in accordance with their own Privacy
          Policy and global compliance standards.
        </p>
        <p>
          We do not collect or store your full credit card information on our
          servers. We only receive limited data from Paddle (such as confirmation
          of payment status and subscription tier) to provision your account
          access.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">4. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul className="list-inside list-disc space-y-2 text-gray-400">
          <li>To provide, operate, and maintain our Service.</li>
          <li>To authenticate users and secure accounts.</li>
          <li>
            To process transactions and manage your access levels (via Paddle).
          </li>
          <li>To respond to your questions, support requests, and feedback.</li>
          <li>
            To monitor usage patterns, debug errors, and improve the user
            experience.
          </li>
          <li>
            To send administrative updates, product announcements, or marketing
            communications (if you have opted in).
          </li>
          <li>To comply with legal obligations and enforce our terms.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">
          5. Service Providers &amp; Third Parties
        </h2>
        <p>
          We do not sell your personal data. We share your information only with
          trusted third-party service providers who assist us in operating our
          Service. These providers process data on our behalf and are bound by
          their own privacy and security policies:
        </p>
        <ul className="list-inside list-disc space-y-2 text-gray-400">
          <li>
            <span className="text-gray-300">Authentication &amp; Database:</span>{' '}
            Supabase
          </li>
          <li>
            <span className="text-gray-300">
              Payment Processing / Merchant of Record:
            </span>{' '}
            Paddle
          </li>
          <li>
            <span className="text-gray-300">Hosting &amp; Infrastructure:</span>{' '}
            Cloudflare
          </li>
          <li>
            <span className="text-gray-300">Analytics &amp; Session Monitoring:</span>{' '}
            PostHog
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">6. Data Retention</h2>
        <p>
          We retain personal information only for as long as is necessary to
          fulfill the purposes outlined in this Privacy Policy, to maintain your
          active account, or as required by law (such as for tax and accounting
          purposes).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">7. Your Data Rights &amp; Choices</h2>
        <p>
          Depending on your location, you may have specific rights regarding your
          personal information, including the right to:
        </p>
        <ul className="list-inside list-disc space-y-2 text-gray-400">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate or incomplete data.</li>
          <li>Request deletion of your personal data.</li>
          <li>
            Opt-out of promotional communications by clicking the
            &ldquo;unsubscribe&rdquo; link in our emails.
          </li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at{' '}
          <a
            href="mailto:support@ryft.us"
            className="text-primary underline-offset-2 hover:underline"
          >
            support@ryft.us
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or legal requirements. We will post the updated
          version on this page and revise the &ldquo;Last updated&rdquo; date at
          the top. We encourage you to review this policy periodically.
        </p>
      </section>
    </LegalDocumentLayout>
  )
}
