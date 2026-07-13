export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-6">
      <h1 className="font-heading text-3xl font-bold">Privacy Policy</h1>
      <p className="text-muted dark:text-muted-dark text-sm">Last updated: July 2026</p>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">1. Data We Collect</h2>
        <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
          We collect your email address, username, date of birth (for age verification), study sessions, and room activity. We do not collect any data beyond what is necessary for the Service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">2. How We Use Data</h2>
        <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
          Your data is used to: provide study tracking, enable room chat, calculate streaks, send email notifications (if opted in), and improve the Service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">3. Data Storage</h2>
        <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
          Data is stored on Supabase servers. We use industry-standard encryption for data in transit and at rest.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">4. Your Rights</h2>
        <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
          You can: access your data, delete your account (all data is removed), opt out of the leaderboard, and request data export (premium feature).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">5. Third Parties</h2>
        <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
          We use Supabase (database/auth), Resend (email), and Netlify (hosting). Each service has its own privacy policy. We do not sell your data.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">6. Contact</h2>
        <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
          For privacy concerns, please contact us through the app or at privacy@cohort.app.
        </p>
      </section>
    </div>
  )
}
