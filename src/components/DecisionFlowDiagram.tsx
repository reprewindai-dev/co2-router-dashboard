import { BrandLogo } from './BrandLogo'

const flowCards = [
  {
    title: 'Caller / Workload',
    body: 'App middleware, CI runner, scheduler, webhook, or queue dispatcher requests authorization.',
  },
  {
    title: 'CO2 Router Decision Engine',
    body: 'Doctrine evaluates policy, water guardrails, runtime posture, and proof state before execution.',
  },
  {
    title: 'Execution Target',
    body: 'Allowed work continues in the chosen region or runtime with one binding action returned.',
  },
  {
    title: 'Proof + Telemetry',
    body: 'Decision frame, proof hash, adapter context, and replay metadata stay attached to the result.',
  },
] as const

const supportingPanels = [
  {
    title: 'Signals evaluated',
    body: 'Carbon freshness, water authority, disagreement, latency posture, fallback state, and provider health.',
  },
  {
    title: 'Policy checks',
    body: 'Hard overrides, water guardrails, SLA protection, environmental optimization inside the allowed envelope, and cost late in the stack.',
  },
  {
    title: 'Decision artifact',
    body: 'One decision frame, one proof hash, and one replayable envelope that downstream control points can enforce.',
  },
] as const

export function DecisionFlowDiagram() {
  return (
    <div className="space-y-5">
      <div className="eyebrow">How it works</div>
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">A decision system that visibly moves work through control.</h2>

      <div className="relative grid gap-4 xl:grid-cols-4">
        <div className="pointer-events-none absolute left-[12%] right-[12%] top-1/2 hidden h-px -translate-y-1/2 bg-[linear-gradient(90deg,rgba(125,211,252,0.1),rgba(125,211,252,0.95),rgba(190,242,100,0.1))] xl:block" />
        <div className="pointer-events-none absolute left-[12%] right-[12%] top-1/2 hidden h-px -translate-y-1/2 xl:block">
          <div className="flow-pulse h-full w-24 rounded-full bg-[linear-gradient(90deg,rgba(125,211,252,0),rgba(125,211,252,0.95),rgba(190,242,100,0))]" />
        </div>

        {flowCards.map((card, index) => (
          <div key={card.title} className="surface-card relative overflow-hidden p-5">
            <div className="pointer-events-none absolute right-4 top-4 opacity-[0.12]">
              <BrandLogo variant="icon" className="h-10 w-auto" alt="" />
            </div>
            <div className="eyebrow">Step {index + 1}</div>
            <div className="mt-3 text-xl font-semibold text-white">{card.title}</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{card.body}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {supportingPanels.map((panel) => (
          <div key={panel.title} className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="eyebrow">{panel.title}</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{panel.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
