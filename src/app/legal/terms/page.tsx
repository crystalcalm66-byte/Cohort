export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-6">
      <h1 className="font-heading text-3xl font-bold">Terms of Service</h1>
      <p className="text-muted dark:text-muted-dark text-sm">Last updated: July 2026</p>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
          By accessing or using Cohort, you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">2. Eligibility</h2>
        <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
          You must be at least 13 years old to use Cohort. If you are under 18, you represent that you have parental consent.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">3. User Conduct</h2>
        <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
          You agree not to misuse the Service, including but not limited to: harassment, spam, sharing harmful content, or attempting to cheat the timer system.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">4. Data & Privacy</h2>
        <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
          Your data is handled as described in our Privacy Policy. We use Supabase for storage and Resend for email communications.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">5. Termination</h2>
        <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
          We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time from Settings.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">6. Changes</h2>
        <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
          We may update these terms. Continued use after changes constitutes acceptance.
        </p>
      </section>
    </div>
  )
}
