'use client'

import { humanizeReasonCode } from '@/lib/control-surface/labels'
import type { LiveSystemSnapshot } from '@/types/control-surface'

function compactHash(value: string | null) {
  if (!value) return 'unavailable'
  if (value.length <= 18) return value
  return `${value.slice(0, 10)}...${value.slice(-6)}`
}

export function RecentDecisionsList({
  decisions,
}: {
  decisions: LiveSystemSnapshot['recentDecisions']
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">Recent Decisions</div>
      {!decisions.available ? (
        <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {decisions.error ?? 'Recent decisions are unavailable.'}
        </div>
      ) : decisions.items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
          No recent decisions are available.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {decisions.items.map((decision) => (
            <article
              key={decision.decisionFrameId}
              className="rounded-2xl border border-white/8 bg-slate-950/60 px-4 py-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                  {decision.action.replace(/_/g, ' ')}
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  {decision.selectedRegion}
                </div>
              </div>
              <div className="mt-3 text-sm leading-7 text-slate-300">
                {humanizeReasonCode(decision.reasonCode)}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {[
                  ['frame', decision.decisionFrameId.slice(0, 8)],
                  ['proof', compactHash(decision.proofHash)],
                  ['trace', decision.traceAvailable ? 'available' : 'missing'],
                  ['governance', decision.governanceSource ?? 'NONE'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2"
                  >
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      {label}
                    </div>
                    <div className="mt-1 font-mono text-[11px] tracking-[0.08em] text-slate-400">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
