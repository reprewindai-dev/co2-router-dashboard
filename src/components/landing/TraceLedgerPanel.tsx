'use client'

import type { LiveSystemSnapshot } from '@/types/control-surface'

function compactHash(value: string | null) {
  if (!value) return 'unavailable'
  if (value.length <= 18) return value
  return `${value.slice(0, 10)}...${value.slice(-6)}`
}

export function TraceLedgerPanel({
  traceLedger,
}: {
  traceLedger: LiveSystemSnapshot['traceLedger']
}) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">Trace Ledger</div>
      {!traceLedger.available ? (
        <p className="mt-4 text-sm leading-7 text-slate-300">
          {traceLedger.error ?? 'Trace ledger state is unavailable.'}
        </p>
      ) : (
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          {[
            ['trace available', traceLedger.traceAvailable ? 'yes' : 'no'],
            [
              'replay consistency',
              traceLedger.replayConsistent == null
                ? 'unavailable'
                : traceLedger.replayConsistent
                  ? 'consistent'
                  : 'mismatch',
            ],
            ['proof availability', traceLedger.proofAvailable ? 'available' : 'missing'],
            ['sequence', traceLedger.sequenceNumber?.toString() ?? 'n/a'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                {label}
              </div>
              <div className="mt-1 text-sm font-semibold text-white">{value}</div>
            </div>
          ))}
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">trace ref</div>
            <div className="mt-1 font-mono text-[11px] tracking-[0.08em] text-slate-400">
              {compactHash(traceLedger.traceHash)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">input ref</div>
            <div className="mt-1 font-mono text-[11px] tracking-[0.08em] text-slate-400">
              {compactHash(traceLedger.inputSignalHash)}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
