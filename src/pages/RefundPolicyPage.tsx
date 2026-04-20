import { LegalDocumentLayout } from '../components/LegalDocumentLayout'

export function RefundPolicyPage() {
  return (
    <LegalDocumentLayout title="Refund Policy" lastUpdated="April 19, 2026">
      <p>
        This Refund Policy outlines the terms under which RYFT LLC
        (&ldquo;RYFT,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;) handles purchases made through our website and
        applications.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">1. Merchant of Record</h2>
        <p>
          Our order process is conducted by our online reseller Paddle.com.
          Paddle is the Merchant of Record for all our orders. This means that
          Paddle handles all payment processing, tax collection, and the actual
          execution of transactions. All purchases and any legally mandated
          refund requests are subject to Paddle&rsquo;s Terms and Conditions and
          global compliance standards.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">2. All Sales Are Final</h2>
        <p>
          Because RYFT provides immediate access to digital software and tools,
          all sales are final and we do not offer refunds. By completing your
          purchase and accessing the Service, you acknowledge and agree that you
          are waiving any right to a refund, except in cases where a refund is
          strictly required by applicable mandatory consumer protection laws in
          your jurisdiction (such as the UK or EU).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">
          3. Subscriptions and Cancellations
        </h2>
        <p>
          If you subscribe to a recurring plan, you may cancel your renewal at any
          time through your account settings or billing portal.
        </p>
        <p>
          <span className="font-semibold text-gray-200">Cancellations:</span>{' '}
          Canceling your subscription prevents future charges. You will continue
          to have full access to the Service until the end of your currently paid
          billing period.
        </p>
        <p>
          <span className="font-semibold text-gray-200">No Partial Refunds:</span>{' '}
          We do not offer prorated refunds or credits for partially used billing
          periods, unused time, or accidental renewals. It is your responsibility
          to cancel your subscription before the renewal date if you do not wish
          to be charged.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">4. Exceptions and Legal Rights</h2>
        <p>
          In the rare event that we completely fail to deliver the purchased
          access through a technical fault of our own, or if you reside in a
          jurisdiction where a refund cannot be legally waived (e.g., specific
          European Union consumer rights directives), Paddle will process the
          refund in accordance with those local laws.
        </p>
        <p>
          To inquire about a legally mandated refund, please contact us at{' '}
          <a
            href="mailto:support@ryft.us"
            className="text-primary underline-offset-2 hover:underline"
          >
            support@ryft.us
          </a>{' '}
          with your Paddle Order ID.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">5. Chargebacks and Disputes</h2>
        <p>
          We ask that you contact us at{' '}
          <a
            href="mailto:support@ryft.us"
            className="text-primary underline-offset-2 hover:underline"
          >
            support@ryft.us
          </a>{' '}
          to resolve any billing confusion before initiating a chargeback or
          payment dispute with your bank or credit card company.
        </p>
        <p>
          Because we maintain a strict no-refund policy, unwarranted chargebacks
          or fraudulent disputes are considered a violation of our Terms of
          Service. Initiating a chargeback will result in the immediate and
          permanent termination of your account and access to the Service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">6. Changes to this Policy</h2>
        <p>
          We may update this policy from time to time. The &ldquo;Last
          updated&rdquo; date at the top will reflect the most recent version.
          Continued use of paid services after changes are posted constitutes
          acceptance of the updated policy.
        </p>
      </section>
    </LegalDocumentLayout>
  )
}
