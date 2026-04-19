import { LegalDocumentLayout } from '../components/LegalDocumentLayout'

export function RefundPolicyPage() {
  return (
    <LegalDocumentLayout title="Refund Policy" lastUpdated="April 19, 2026">
      <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-amber-100/90">
        This refund policy is a template for a pre-launch product. Align it with
        your payment processor, local law, and counsel before you rely on it.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Overview</h2>
        <p>
          RYFT (“we,” “us”) wants you to be satisfied with purchases made through
          our website or app. This policy describes when you may be eligible for a
          refund. Payment processing may be handled by a third party (for example,
          Paddle); their terms and dispute timelines may also apply.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Founding / beta purchases</h2>
        <p>
          If you purchase a founding seat, lifetime access, or similar one-time
          offer during beta, you may request a full refund within{' '}
          <span className="font-medium text-white">14 days</span> of the original
          purchase date, provided you have not materially abused the offer (for
          example, chargeback fraud or license sharing contrary to our Terms).
        </p>
        <p>
          After that window, fees are generally non-refundable except where
          required by law or where we fail to deliver the purchased access through
          no fault of yours.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Subscriptions</h2>
        <p>
          If you subscribe to a recurring plan, you may cancel renewal at any time
          in your account or billing portal. Cancellation stops future charges; it
          does not automatically refund the current billing period unless required
          by law or stated at checkout.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">How to request a refund</h2>
        <p>
          Email{' '}
          <a
            href="mailto:info@ryft.us?subject=Refund%20request"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            info@ryft.us
          </a>{' '}
          from the email address used at purchase and include your order or
          transaction reference if you have one. We aim to respond within a few
          business days.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Chargebacks</h2>
        <p>
          Please contact us before initiating a chargeback or payment dispute so we
          can try to resolve the issue. Unwarranted chargebacks may result in
          suspension of access.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Changes</h2>
        <p>
          We may update this policy. The “Last updated” date at the top will
          change when we do. Continued use of paid services after changes may be
          subject to the policy in effect at the time of your purchase.
        </p>
      </section>
    </LegalDocumentLayout>
  )
}
