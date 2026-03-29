import { GovernancePanel } from '@/components/landing/GovernancePanel'
import { InformationPageShell } from '@/components/site/InformationPageShell'
import { getLiveSystemSnapshot } from '@/lib/control-surface/live-system'

export const dynamic = 'force-dynamic'

export default async function SystemSaiqGovernancePage() {
  const snapshot = await getLiveSystemSnapshot()

  return (
    <InformationPageShell
      eyebrow="System / SAIQ Governance"
      title="SAIQ is the governance layer the website can name honestly."
      summary="On the public surface, SAIQ is the label for the governance state attached to live decision traces. It explains whether governance is active, where policy input came from, and which latest reason code shaped the decision."
      secondaryHref="/system/trace-ledger"
      secondaryLabel="View Trace Ledger"
    >
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">What SAIQ means here</div>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
            <p>SAIQ is the public governance label for the policy state attached to decision traces.</p>
            <p>
              It does not replace the decision engine. It names the governance outcome that shaped
              the frame before execution.
            </p>
            <p>
              The site only reports SAIQ as active when the latest trace reports a non-NONE
              governance source.
            </p>
          </div>
        </article>
        <GovernancePanel governance={snapshot.governance} />
      </section>
    </InformationPageShell>
  )
}
