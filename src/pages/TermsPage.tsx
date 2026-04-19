import { LegalDocumentLayout } from '../components/LegalDocumentLayout'

export function TermsPage() {
  return (
    <LegalDocumentLayout title="Terms of Service" lastUpdated="April 19, 2026">
      <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-amber-100/90">
        These terms are a starting point for a pre-launch site. Have them
        reviewed by qualified counsel before commercial use.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Agreement</h2>
        <p>
          By accessing or using RYFT’s website, waitlist, or related services
          (the “Service”), you agree to these Terms. If you do not agree, do not
          use the Service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">The Service</h2>
        <p>
          RYFT provides tools and content related to text-to-audio and related
          features. The Service may change, and features on this landing page may
          be demonstrations or not yet generally available.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Accounts</h2>
        <p>
          If you create an account, you are responsible for your credentials and
          for activity under your account. You must provide accurate information
          and comply with applicable laws.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Acceptable use</h2>
        <p>
          You may not misuse the Service—for example by attempting unauthorized
          access, interfering with other users, or using the Service to violate
          others’ rights or applicable law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Intellectual property</h2>
        <p>
          RYFT and its licensors own the Service, branding, and related
          materials, except where third-party rights apply. You receive a
          limited, revocable license to use the Service as offered.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Disclaimers</h2>
        <p>
          The Service is provided “as is” and “as available.” To the fullest
          extent permitted by law, we disclaim warranties of merchantability,
          fitness for a particular purpose, and non-infringement.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, RYFT and its suppliers will
          not be liable for indirect, incidental, special, consequential, or
          punitive damages, or for loss of profits, data, or goodwill. Our
          aggregate liability for claims relating to the Service is limited to
          the greater of amounts you paid us in the twelve months before the
          claim or fifty U.S. dollars.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Indemnity</h2>
        <p>
          You will defend and indemnify RYFT against claims arising from your
          misuse of the Service or violation of these Terms, to the extent
          permitted by law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Termination</h2>
        <p>
          We may suspend or terminate access to the Service at any time. Provisions
          that by their nature should survive will survive termination.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Governing law</h2>
        <p>
          These Terms are governed by the laws of the United States and the
          State of Delaware, without regard to conflict-of-law rules, except
          where mandatory consumer protections in your jurisdiction apply.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Changes</h2>
        <p>
          We may update these Terms. Continued use after changes constitutes
          acceptance of the updated Terms where allowed by law.
        </p>
      </section>
    </LegalDocumentLayout>
  )
}
