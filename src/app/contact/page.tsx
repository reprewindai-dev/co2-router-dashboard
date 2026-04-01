import { ContactForm } from '@/components/contact/ContactForm'

export default function ContactPage() {
  return (
    <div className="space-y-8 pb-8">
      <section className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_36%),linear-gradient(180deg,rgba(5,10,20,0.96),rgba(2,8,18,0.98))] p-6 sm:p-8 lg:p-10">
        <div className="max-w-4xl">
          <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300">Contact</div>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            Route the first production conversation through the live intake path.
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 sm:text-base">
            General contact, deployment support, and security reporting all route through the
            shared monitored inbox. Priority classes escalate to the founder, but the operating
            inbox remains the system of record.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Sales</div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Commercial evaluation, enterprise rollout, and design-partner qualification.
              </p>
            </article>
            <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Support</div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Operational issues, adapter debugging, and active control-surface help.
              </p>
            </article>
            <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Security</div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Responsible disclosure, trust concerns, and provenance/security questions.
              </p>
            </article>
          </div>

          <div className="rounded-[28px] border border-cyan-300/12 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.12),transparent_60%),rgba(2,8,23,0.84)] p-6">
            <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-200">
              Mail path
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Submission, validation, rate limiting, intake delivery, and acknowledgment all run on
              the live engine-backed path. No dead email cards and no silent success states.
            </p>
          </div>
        </div>

        <ContactForm />
      </section>
    </div>
  )
}
