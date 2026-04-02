'use client'

import type {
  CommandCenterDecisionItem,
  DecisionTraceRawRecord,
  LiveSystemReplayResponse,
} from '@/types/control-surface'

function shortHash(value: string | null | undefined, length = 12) {
  if (!value) return 'Unavailable'
  return value.length <= length ? value : `${value.slice(0, length)}...`
}

export function CommandCenterTruthRail({
  selectedDecision,
  selectedTrace,
  selectedReplay,
}: {
  selectedDecision: CommandCenterDecisionItem | null
  selectedTrace: DecisionTraceRawRecord | null
  selectedReplay: LiveSystemReplayResponse | null
}) {
  const cards = [
    {
      title: 'Decides before execution',
      value: selectedDecision
        ? `${selectedDecision.action.replace(/_/g, ' ')} -> ${selectedDecision.selectedRegion}`
        : 'Awaiting frame',
      detail:
        'The control plane binds the action before the workload starts instead of reporting after the fact.',
    },
    {
      title: 'Explains why',
      value: selectedDecision?.reasonCode ?? 'Awaiting frame',
      detail:
        selectedTrace?.payload.governance.source && selectedTrace.payload.governance.source !== 'NONE'
          ? `${selectedTrace.payload.governance.source} is active on the selected frame.`
          : 'Governance source is exposed directly on the selected frame.',
    },
    {
      title: 'Trust stays visible',
      value: selectedTrace?.payload.performance.cacheHit ? 'cache-backed' : 'live-resolved',
      detail:
        selectedTrace
          ? `${selectedTrace.payload.governance.constraintsApplied.length} constraints were applied with provider freshness and fallback posture preserved in trace.`
          : 'Fallback, degraded trust, and provider posture remain visible in operator views.',
    },
    {
      title: 'Proof and replay stay attached',
      value: selectedReplay?.deterministicMatch ? 'deterministic match' : shortHash(selectedDecision?.proofHash),
      detail:
        selectedReplay?.deterministicMatch
          ? `Replay verified ${selectedReplay.decisionFrameId}.`
          : 'Each frame keeps its proof hash and replay posture attached to the same governed decision.',
    },
  ]

  return (
    <section className="grid gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
        >
          <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-300">{card.title}</div>
          <div className="mt-3 text-lg font-semibold text-white">{card.value}</div>
          <p className="mt-3 text-sm leading-6 text-slate-300">{card.detail}</p>
        </article>
      ))}
    </section>
  )
}
