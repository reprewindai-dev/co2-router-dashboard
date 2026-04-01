'use client'

import { motion } from 'framer-motion'

import { formatAction } from '@/components/control-surface/action-styles'
import { humanizeReasonCode } from '@/lib/control-surface/labels'
import type { CiRouteResponse, ControlSurfaceDecisionSummary } from '@/types/control-surface'

function isRouteResponse(
  decision: CiRouteResponse | ControlSurfaceDecisionSummary
): decision is CiRouteResponse {
  return 'decision' in decision
}

export function DecisionExampleCard({
  decision,
  proofContext,
}: {
  decision: CiRouteResponse | ControlSurfaceDecisionSummary
  proofContext: {
    governance: string
    replay: string
    provenance: string
  }
}) {
  const action = formatAction(isRouteResponse(decision) ? decision.decision : decision.action)
  const routeDecision = isRouteResponse(decision) ? decision : null
  const summaryDecision = routeDecision ? null : (decision as ControlSurfaceDecisionSummary)

  const baselineRegion = routeDecision?.baseline.region ?? 'baseline region'
  const selectedRegion =
    routeDecision?.selected.region ?? summaryDecision?.selectedRegion ?? 'selected region'
  const baselineCarbon =
    routeDecision?.baseline.carbonIntensity ?? summaryDecision?.baselineCarbonIntensity ?? 0
  const selectedCarbon =
    routeDecision?.selected.carbonIntensity ?? summaryDecision?.carbonIntensity ?? 0
  const baselineWater =
    routeDecision?.baseline.waterImpactLiters ?? summaryDecision?.waterBaselineLiters ?? 0
  const selectedWater =
    routeDecision?.selected.waterImpactLiters ?? summaryDecision?.waterSelectedLiters ?? 0
  const carbonReductionPct =
    routeDecision?.savings.carbonReductionPct ?? summaryDecision?.carbonReductionPct ?? 0
  const waterImpactDeltaLiters =
    routeDecision?.savings.waterImpactDeltaLiters ?? summaryDecision?.waterImpactDeltaLiters ?? 0
  const reasonCodes = (routeDecision?.policyTrace.reasonCodes ?? [decision.reasonCode]).slice(0, 4)
  const primaryReason = reasonCodes[0] ? humanizeReasonCode(reasonCodes[0]) : 'Governed decision'

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      className={`rounded-[32px] border bg-slate-950/72 p-6 backdrop-blur sm:p-8 ${action.border} ${action.glow}`}
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300">
            Decision detail
          </div>
          <h3 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            One selected outcome, one governed record.
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            This is the operating shape of the product: the baseline, the selected outcome, and the
            governing reason stay attached to the same frame.
          </p>
        </div>

        <div className="flex items-start justify-end">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${action.badge}`}
          >
            {action.label}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Baseline</div>
              <div className="mt-2 text-xl font-bold text-white">{baselineRegion}</div>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <div>{baselineCarbon} gCO2/kWh</div>
                <div>{baselineWater.toFixed(2)} L estimated</div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Selected</div>
              <div className="mt-2 text-xl font-bold text-white">{selectedRegion}</div>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <div>{selectedCarbon} gCO2/kWh</div>
                <div>{selectedWater.toFixed(2)} L estimated</div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Action</div>
              <div className="mt-2 text-lg font-bold text-white">{action.label}</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Carbon delta
              </div>
              <div className="mt-2 text-lg font-bold text-white">
                {carbonReductionPct.toFixed(1)}%
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Water delta</div>
              <div className="mt-2 text-lg font-bold text-white">
                {waterImpactDeltaLiters.toFixed(2)} L
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Decision basis
              </div>
              <div className="mt-2 text-lg font-bold text-white">{primaryReason}</div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Evidence summary
          </div>
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Why</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">
                {routeDecision?.recommendation ??
                  summaryDecision?.summaryReason ??
                  'Decision rationale stays attached to the governed record.'}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {reasonCodes.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300"
                  >
                    {humanizeReasonCode(reason)}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Governance
                </div>
                <div className="mt-2 text-sm font-semibold text-white">{proofContext.governance}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Replay posture
                </div>
                <div className="mt-2 text-sm font-semibold text-white">{proofContext.replay}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Provenance
                </div>
                <div className="mt-2 text-sm text-white">{proofContext.provenance}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
