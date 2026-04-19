import { LegalDocumentLayout } from '../components/LegalDocumentLayout'

export function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout title="Privacy Policy" lastUpdated="April 19, 2026">
      <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-amber-100/90">
        This is a starter policy for a pre-launch product. Have it reviewed by
        qualified counsel before you rely on it for compliance.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Who we are</h2>
        <p>
          RYFT (“we,” “us”) operates this website and related services. Contact:
          use the channels published on the site when available.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">What we collect</h2>
        <ul className="list-inside list-disc space-y-2 text-gray-400">
          <li>
            <span className="text-gray-300">Account data:</span> If you create an
            account or sign in (for example with email or Google), we and our
            authentication provider process identifiers such as email address,
            name, and profile image as provided by you or the sign-in provider.
          </li>
          <li>
            <span className="text-gray-300">Interest and waitlist:</span> If you
            submit a form to express interest, subscribe, or join a waitlist, we
            collect the information you submit (such as email).
          </li>
          <li>
            <span className="text-gray-300">Technical data:</span> Like most
            sites, our hosting and analytics tools may process IP address,
            device/browser type, and general usage data in server or error logs.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">How we use information</h2>
        <p>
          We use this information to run the service, authenticate users,
          respond to you, send product updates if you opt in, improve security
          and reliability, and meet legal obligations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Service providers</h2>
        <p>
          We use trusted third parties to host infrastructure and provide
          features—for example authentication and database services (such as
          Supabase). They process data on our behalf under their terms and
          privacy policies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Retention</h2>
        <p>
          We keep information only as long as needed for the purposes above,
          unless a longer period is required by law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Your choices</h2>
        <p>
          Where applicable, you may request access, correction, or deletion of
          your personal information, or object to certain processing, subject to
          law. Use the contact method we publish on the site.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Changes</h2>
        <p>
          We may update this policy from time to time. We will post the new
          version here and adjust the “Last updated” date.
        </p>
      </section>
    </LegalDocumentLayout>
  )
}
