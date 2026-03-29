import { InformationPageShell } from '@/components/site/InformationPageShell'

export default function CompanyAboutPage() {
  return (
    <InformationPageShell
      eyebrow="Company / About"
      title="CO2 Router is built as execution authority, not reporting software."
      summary="The public company surface stays narrow on purpose: CO2 Router is a deterministic environmental execution control plane that decides whether compute runs, records proof, and supports replay."
      secondaryHref="/methodology"
      secondaryLabel="View Methodology"
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {[
          'Pre-execution authorization instead of post-hoc reporting.',
          'Proof, trace, and replay as part of the product contract.',
          'Water authority as a first-class decision constraint.',
        ].map((line) => (
          <article
            key={line}
            className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-sm leading-7 text-slate-300"
          >
            {line}
          </article>
        ))}
      </section>
    </InformationPageShell>
  )
}
