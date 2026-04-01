const flowCards = [
  {
    title: 'Signals',
    body: 'Carbon, water, latency, and runtime posture are normalized into a bounded decision input.',
  },
  {
    title: 'SAIQ Governance',
    body: 'Weighting, constraint logic, and zone posture shape the decision frame before execution.',
  },
  {
    title: 'Policy',
    body: 'Water guardrails, hard overrides, and execution rules determine what is admissible.',
  },
  {
    title: 'Decision',
    body: 'The engine returns one binding action: run, reroute, delay, throttle, or deny.',
  },
  {
    title: 'Proof',
    body: 'Proof hash, trace state, replay posture, and provenance remain attached to the same frame.',
  },
] as const

export function DecisionFlowDiagram() {
  return (
    <div className="space-y-5">
      <div className="eyebrow">How it works</div>
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">
        Signals become one binding decision path.
      </h2>
      <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
        The engine ranks feasible candidates first. SAIQ governance then applies doctrine,
        thresholds, and zone posture before SEKED policy returns the final action.
      </p>

      <div className="relative grid gap-4 xl:grid-cols-5">
        <div className="pointer-events-none absolute left-[12%] right-[12%] top-1/2 hidden h-px -translate-y-1/2 bg-[linear-gradient(90deg,rgba(125,211,252,0.1),rgba(125,211,252,0.95),rgba(190,242,100,0.1))] xl:block" />
        <div className="pointer-events-none absolute left-[12%] right-[12%] top-1/2 hidden h-px -translate-y-1/2 xl:block">
          <div className="flow-pulse h-full w-24 rounded-full bg-[linear-gradient(90deg,rgba(125,211,252,0),rgba(125,211,252,0.95),rgba(190,242,100,0))]" />
        </div>

        {flowCards.map((card, index) => (
          <div key={card.title} className="surface-card relative overflow-hidden p-5">
            <div className="eyebrow">Step {index + 1}</div>
            <div className="mt-3 text-xl font-semibold text-white">{card.title}</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
