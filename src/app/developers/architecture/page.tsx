import { InformationPageShell } from '@/components/site/InformationPageShell'

const steps = [
  ['Caller', 'A workload requests authorization before execution happens.'],
  ['Decision Engine', 'Carbon, water, latency, cost, and governance constraints are co-evaluated.'],
  ['Execution Target', 'The bound action is enforced against the chosen runtime or control point.'],
  ['Proof / Trace / Replay', 'The system records proof artifacts, trace state, and replay inputs for verification.'],
]

export default function DevelopersArchitecturePage() {
  return (
    <InformationPageShell
      eyebrow="Developers / Architecture"
      title="One decision path from request to proof."
      summary="The public architecture is intentionally simple: caller, decision engine, execution target, and proof. The goal is pre-execution authority with deterministic artifacts, not post-hoc reporting."
      secondaryHref="/system/decision-engine"
      secondaryLabel="View Decision Engine"
    >
      <section className="grid gap-4 lg:grid-cols-4">
        {steps.map(([title, body], index) => (
          <article key={title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Step {index + 1}</div>
            <h2 className="mt-3 text-xl font-bold text-white">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{body}</p>
          </article>
        ))}
      </section>
    </InformationPageShell>
  )
}
