'use client'

import { humanizeReasonCode } from '@/lib/control-surface/labels'
import type { LiveSystemSnapshot } from '@/types/control-surface'

export function GovernancePanel({
  governance,
}: {
  governance: LiveSystemSnapshot['governance']
}) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">Governance</div>
      {!governance.available ? (
        <p className="mt-4 text-sm leading-7 text-slate-300">
          {governance.error ?? 'Governance state is unavailable.'}
        </p>
      ) : (
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">framework</div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <span className="font-semibold text-white">{governance.frameworkLabel}</span>
              <span className="font-semibold text-white">
                {governance.active ? 'active' : 'inactive'}
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              policy state
            </div>
            <div className="mt-1 font-mono text-[11px] tracking-[0.08em] text-slate-400">
              {governance.policyState ?? 'NONE'}
            </div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              latest decision
            </div>
            <div className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-white">
              {governance.latestDecisionAction?.replace(/_/g, ' ') ?? 'unavailable'}
            </div>
            <div className="mt-2 text-sm text-slate-400">
              {governance.latestReasonCode
                ? humanizeReasonCode(governance.latestReasonCode)
                : 'No recent governance result is available.'}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
