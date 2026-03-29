import { ProviderVerificationPanel } from '@/components/landing/ProviderVerificationPanel'
import { TraceLedgerPanel } from '@/components/landing/TraceLedgerPanel'
import { InformationPageShell } from '@/components/site/InformationPageShell'
import { getLiveSystemSnapshot } from '@/lib/control-surface/live-system'

export const dynamic = 'force-dynamic'

export default async function AssurancePage() {
  const snapshot = await getLiveSystemSnapshot()
  const verifiedDatasets = snapshot.providers.datasets.filter(
    (dataset) => dataset.verificationStatus === 'verified'
  ).length
  const assuranceReady =
    snapshot.providers.available &&
    verifiedDatasets === snapshot.providers.datasets.length &&
    snapshot.traceLedger.proofAvailable

  return (
    <InformationPageShell
      eyebrow="Assurance"
      title="Provenance closure and proof posture."
      summary="Assurance on the website means the live authority layer has verified source datasets and the decision path can point to proof and trace artifacts without overclaiming beyond what the system actually returns."
      secondaryHref="/system/provenance"
      secondaryLabel="View Provenance"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Assurance Ready</div>
          <div className="mt-3 text-4xl font-black tracking-[-0.05em] text-white">
            {assuranceReady ? 'Yes' : 'No'}
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Derived from live provenance verification plus proof availability.
          </p>
        </article>
        <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Verified Datasets</div>
          <div className="mt-3 text-4xl font-black tracking-[-0.05em] text-white">
            {verifiedDatasets}/{snapshot.providers.datasets.length}
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Aqueduct, AWARE, WWF, and NREL are tracked individually.
          </p>
        </article>
        <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Proof Posture</div>
          <div className="mt-3 text-4xl font-black tracking-[-0.05em] text-white">
            {snapshot.traceLedger.proofAvailable ? 'Live' : 'Unavailable'}
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Proof on the public surface is only reported when the latest trace exposes it.
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ProviderVerificationPanel providers={snapshot.providers} />
        <TraceLedgerPanel traceLedger={snapshot.traceLedger} />
      </section>
    </InformationPageShell>
  )
}
