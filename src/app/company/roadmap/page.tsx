import { InformationPageShell } from '@/components/site/InformationPageShell'

const workstreams = [
  {
    title: 'Latency hardening',
    detail: 'Reduce warmed decision latency while preserving proof, replay, governance, and water authority.',
  },
  {
    title: 'Trace rollout',
    detail: 'Expand trace-backed inspection across live decision frames and make replay visibility more explicit on the control surface.',
  },
  {
    title: 'Adapter maturity',
    detail: 'Keep the canonical decision core stable while raising the maturity of the runtime adapter plane.',
  },
]

export default function CompanyRoadmapPage() {
  return (
    <InformationPageShell
      eyebrow="Company / Roadmap"
      title="Current workstreams only."
      summary="This page is intentionally narrow. It names the engineering tracks that are active now and avoids speculative promises."
      secondaryHref="/status"
      secondaryLabel="View Status"
    >
      <section className="grid gap-4 md:grid-cols-3">
        {workstreams.map((item) => (
          <article key={item.title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold text-white">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{item.detail}</p>
          </article>
        ))}
      </section>
    </InformationPageShell>
  )
}
