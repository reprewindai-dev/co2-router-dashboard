'use client'

import { useLiveSystemSnapshot } from '@/lib/hooks/control-surface'
import { GovernancePanel } from './GovernancePanel'
import { LatencyPanel } from './LatencyPanel'
import { ProviderVerificationPanel } from './ProviderVerificationPanel'
import { RecentDecisionsList } from './RecentDecisionsList'
import { TraceLedgerPanel } from './TraceLedgerPanel'

export function LiveSystemSection() {
  const liveSystemQuery = useLiveSystemSnapshot()

  if (liveSystemQuery.isLoading) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300">Live System</div>
        <div className="mt-4 text-sm text-slate-300">Loading operator data...</div>
      </section>
    )
  }

  if (liveSystemQuery.error || !liveSystemQuery.data) {
    return (
      <section className="rounded-[32px] border border-rose-400/20 bg-rose-400/10 p-6 sm:p-8">
        <div className="text-[11px] uppercase tracking-[0.28em] text-rose-200">Live System</div>
        <div className="mt-4 text-sm text-rose-100">
          {liveSystemQuery.error instanceof Error
            ? liveSystemQuery.error.message
            : 'Failed to load live system state.'}
        </div>
      </section>
    )
  }

  const snapshot = liveSystemQuery.data
  const verifiedDatasets = snapshot.providers.available
    ? snapshot.providers.datasets.filter((dataset) => dataset.verificationStatus === 'verified')
        .length
    : 0

  return (
    <section className="rounded-[32px] border border-cyan-300/16 bg-[linear-gradient(180deg,rgba(2,8,18,0.98),rgba(3,10,24,0.98))] p-6 shadow-[0_24px_120px_rgba(0,0,0,0.3)] sm:p-8">
      <div className="max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300">
          Live operator lane
        </div>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
          Live System / Control Surface
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
          This is the operator view. It surfaces current governance posture, replay state,
          verification status, latency, and recent decisions without repeating the sales story.
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {[
          {
            label: 'Current governance state',
            value:
              snapshot.governance.available && snapshot.governance.policyState
                ? snapshot.governance.policyState
                : 'unavailable',
          },
          {
            label: 'Replay posture',
            value:
              snapshot.traceLedger.available && snapshot.traceLedger.replayConsistent === true
                ? 'consistent'
                : snapshot.traceLedger.available && snapshot.traceLedger.replayConsistent === false
                  ? 'mismatch'
                  : 'available',
          },
          {
            label: 'Verified datasets',
            value: snapshot.providers.available
              ? `${verifiedDatasets}/${snapshot.providers.datasets.length}`
              : 'n/a',
          },
          {
            label: 'Current p95 total',
            value:
              snapshot.latency.available && snapshot.latency.p95TotalMs != null
                ? `${snapshot.latency.p95TotalMs} ms`
                : 'n/a',
          },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              {item.label}
            </div>
            <div className="mt-2 text-lg font-semibold text-white">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <RecentDecisionsList decisions={snapshot.recentDecisions} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TraceLedgerPanel traceLedger={snapshot.traceLedger} />
          <GovernancePanel governance={snapshot.governance} />
          <ProviderVerificationPanel providers={snapshot.providers} />
          <LatencyPanel latency={snapshot.latency} />
        </div>
      </div>
    </section>
  )
}
