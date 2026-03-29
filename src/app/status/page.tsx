import { GovernancePanel } from '@/components/landing/GovernancePanel'
import { LatencyPanel } from '@/components/landing/LatencyPanel'
import { ProviderVerificationPanel } from '@/components/landing/ProviderVerificationPanel'
import { RecentDecisionsList } from '@/components/landing/RecentDecisionsList'
import { TraceLedgerPanel } from '@/components/landing/TraceLedgerPanel'
import { InformationPageShell } from '@/components/site/InformationPageShell'
import { getLiveSystemSnapshot } from '@/lib/control-surface/live-system'

export const dynamic = 'force-dynamic'

export default async function StatusPage() {
  const snapshot = await getLiveSystemSnapshot()

  return (
    <InformationPageShell
      eyebrow="Status"
      title="Live system visibility for the execution control plane."
      summary="This page reflects the current website-facing truth of the control system: recent decisions, trace and replay state, SAIQ governance, verified water datasets, and the live p95 latency window."
      secondaryHref="/assurance"
      secondaryLabel="View Assurance"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Recent Frames</div>
          <div className="mt-3 text-4xl font-black tracking-[-0.05em] text-white">
            {snapshot.recentDecisions.items.length}
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Latest decision frames visible from the live decision endpoint.
          </p>
        </article>
        <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Trace</div>
          <div className="mt-3 text-4xl font-black tracking-[-0.05em] text-white">
            {snapshot.traceLedger.traceAvailable ? 'Live' : 'Unavailable'}
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Curated trace and replay state for the latest decision frame.
          </p>
        </article>
        <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Latency</div>
          <div className="mt-3 text-4xl font-black tracking-[-0.05em] text-white">
            {snapshot.latency.p95TotalMs == null ? 'n/a' : `${snapshot.latency.p95TotalMs} ms`}
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Current p95 total latency from the live SLO window.
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <RecentDecisionsList decisions={snapshot.recentDecisions} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TraceLedgerPanel traceLedger={snapshot.traceLedger} />
          <GovernancePanel governance={snapshot.governance} />
          <ProviderVerificationPanel providers={snapshot.providers} />
          <LatencyPanel latency={snapshot.latency} />
        </div>
      </section>
    </InformationPageShell>
  )
}
