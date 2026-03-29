import { ProviderVerificationPanel } from '@/components/landing/ProviderVerificationPanel'
import { InformationPageShell } from '@/components/site/InformationPageShell'
import { getLiveSystemSnapshot } from '@/lib/control-surface/live-system'

export const dynamic = 'force-dynamic'

export default async function SystemProvenancePage() {
  const snapshot = await getLiveSystemSnapshot()

  return (
    <InformationPageShell
      eyebrow="System / Provenance"
      title="Verified water datasets behind the authority layer."
      summary="This page reflects the live provenance route for the four water datasets the public surface promises to track: Aqueduct, AWARE, WWF, and NREL."
      secondaryHref="/assurance"
      secondaryLabel="View Assurance"
    >
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Provenance rule</div>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
            <p>The website only reports these datasets because the engine exposes them through the live provenance endpoint.</p>
            <p>Each row records verification status plus manifest and computed hashes when available.</p>
          </div>
        </article>
        <ProviderVerificationPanel providers={snapshot.providers} />
      </section>
    </InformationPageShell>
  )
}
