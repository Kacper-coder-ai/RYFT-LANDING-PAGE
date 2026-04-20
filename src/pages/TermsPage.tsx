import { Link } from 'react-router-dom'
import { LegalDocumentLayout } from '../components/LegalDocumentLayout'

export function TermsPage() {
  return (
    <LegalDocumentLayout title="Terms of Service" lastUpdated="April 19, 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of the website, applications, and related text-to-audio services
        (collectively, the &ldquo;Service&rdquo;) provided by RYFT LLC
        (&ldquo;RYFT,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;). By accessing or using the Service, you agree to be
        bound by these Terms. If you do not agree, do not use the Service.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">1. The Service</h2>
        <p>
          RYFT provides tools and software designed to ingest text and generate
          audio playback. The Service is subject to change, and certain features
          may be in beta, demonstrations, or not yet generally available. We
          reserve the right to modify, suspend, or discontinue the Service at any
          time without notice.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">
          2. Payments and Merchant of Record
        </h2>
        <p>
          Our order process is conducted by our online reseller Paddle.com.
          Paddle.com is the Merchant of Record for all our orders.
        </p>
        <p>
          By purchasing a subscription or license to RYFT, you are explicitly
          agreeing to Paddle&rsquo;s Terms and Conditions. Paddle is responsible
          for the processing of all financial transactions, tax compliance, and
          handles all billing-related customer service inquiries. Your payment
          method will be charged by Paddle, and the transaction will appear on
          your statement as an order from Paddle.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">
          3. Subscriptions, Cancellations, and Refunds
        </h2>
        <p>
          <span className="font-semibold text-gray-200">Billing:</span> If you
          purchase a recurring subscription, it will automatically renew at the
          end of the billing cycle unless canceled.
        </p>
        <p>
          <span className="font-semibold text-gray-200">Cancellations:</span> You
          may cancel your subscription at any time through your account settings
          or by contacting our support. Cancellation will take effect at the end
          of your current billing period.
        </p>
        <p>
          <span className="font-semibold text-gray-200">Refund Policy:</span> All
          sales are final and we do not offer refunds, except where a refund is
          strictly required by applicable mandatory consumer protection laws in
          your jurisdiction. We do not offer prorated refunds for partial billing
          periods where not legally required. Details are in our{' '}
          <Link
            to="/refunds"
            className="text-primary underline-offset-2 hover:underline"
          >
            Refund Policy
          </Link>
          . Because Paddle is the Merchant of Record, refund and chargeback
          handling is also subject to Paddle&rsquo;s Terms and global compliance
          standards.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">4. Accounts and Security</h2>
        <p>
          To use certain features, you must create an account. You are solely
          responsible for maintaining the confidentiality of your account
          credentials and for all activities that occur under your account. You
          must provide accurate information and immediately notify us of any
          unauthorized use of your account.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">5. Acceptable Use and Copyright</h2>
        <p>
          RYFT provides a tool to process and listen to text. You are solely
          responsible for the content you ingest into the Service.
        </p>
        <ul className="list-inside list-disc space-y-2 text-gray-400">
          <li>
            You may only process text, documents, or web content for which you
            have the legal right, permission, or license to access and
            reproduce.
          </li>
          <li>
            You may not use the Service to pirate, distribute, or commercially
            exploit copyrighted material without authorization from the rights
            holder.
          </li>
          <li>
            You may not attempt to gain unauthorized access to the Service,
            interfere with the Service&rsquo;s operation, or use the Service to
            violate any local, state, national, or international law.
          </li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that repeatedly
          infringe on intellectual property rights or violate this Acceptable
          Use policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">6. Intellectual Property</h2>
        <p>
          RYFT and its licensors retain all right, title, and interest in and to
          the Service, including all underlying software, branding, UI, and
          algorithms. You receive a limited, personal, non-exclusive,
          non-transferable, and revocable license to use the Service strictly in
          accordance with these Terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">7. Disclaimers</h2>
        <p>
          The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; basis. To the fullest extent permitted by law, RYFT
          LLC disclaims all warranties, express or implied, including warranties
          of merchantability, fitness for a particular purpose, and
          non-infringement. We do not warrant that the Service will be
          uninterrupted, error-free, or completely secure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">8. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, RYFT LLC, its officers,
          employees, and suppliers will not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or any loss of
          profits, revenues, data, or goodwill. Our maximum aggregate liability
          for any claims arising out of or relating to these Terms or the Service
          is limited to the greater of (a) the amount you paid to us (via
          Paddle) in the twelve (12) months preceding the claim, or (b) fifty
          U.S. dollars ($50.00).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">9. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless RYFT LLC from and
          against any claims, damages, obligations, losses, liabilities, costs, or
          debt arising from: (a) your use of and access to the Service; (b) your
          violation of any term of these Terms; or (c) your violation of any
          third-party right, including any copyright, property, or privacy right
          regarding the text you process through the Service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">10. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the State of Illinois, without regard to its conflict of law
          provisions. Any legal action or proceeding arising under these Terms
          will be brought exclusively in the federal or state courts located in
          Illinois, and the parties hereby irrevocably consent to the personal
          jurisdiction and venue therein.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">11. Changes to These Terms</h2>
        <p>
          We may revise these Terms from time to time. The most current version
          will always be posted on our website. By continuing to access or use the
          Service after revisions become effective, you agree to be bound by the
          updated Terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">12. Contact Information</h2>
        <p>If you have any questions about these Terms, please contact us at:</p>
        <p className="text-gray-300">
          RYFT LLC
          <br />
          <a
            href="mailto:support@ryft.us"
            className="text-primary underline-offset-2 hover:underline"
          >
            support@ryft.us
          </a>
          <br />
          <span className="text-gray-400">
          102 N MAIN STREET
          MOUNT PROSPECT,IL 60056
          </span>
        </p>
      </section>
    </LegalDocumentLayout>
  )
}
