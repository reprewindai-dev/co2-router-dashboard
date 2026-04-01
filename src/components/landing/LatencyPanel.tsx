'use client'

import { latencyToneClass } from '@/lib/control-surface/labels'
import type { LiveSystemSnapshot } from '@/types/control-surface'

export function LatencyPanel({
  latency,
}: {
  latency: LiveSystemSnapshot['latency']
}) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">Latency</div>
      {!latency.available ? (
        <p className="mt-4 text-sm leading-7 text-slate-300">
          {latency.error ?? 'Latency metrics are unavailable.'}
        </p>
      ) : (
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          {[
            ['decision samples', latency.samples?.toString() ?? 'n/a', 'text-white'],
            [
              'p95 total',
              latency.p95TotalMs == null ? 'n/a' : `${latency.p95TotalMs} ms`,
              latencyToneClass(latency.p95TotalMs),
            ],
            [
              'p95 compute',
              latency.p95ComputeMs == null ? 'n/a' : `${latency.p95ComputeMs} ms`,
              latencyToneClass(latency.p95ComputeMs),
            ],
          ].map(([label, value, tone]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                {label}
              </div>
              <div className={`mt-1 text-sm font-semibold ${tone}`}>{value}</div>
            </div>
          ))}
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">budget</div>
            <div className="mt-1 font-mono text-[11px] tracking-[0.08em] text-slate-400">
              {latency.budgetTotalP95Ms ?? 'n/a'} / {latency.budgetComputeP95Ms ?? 'n/a'} ms
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
