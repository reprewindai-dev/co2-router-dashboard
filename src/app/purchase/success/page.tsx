import Link from 'next/link'

import { PurchaseStatusCard } from '@/components/commerce/PurchaseStatusCard'

export default function PurchaseSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const sessionId = searchParams.session_id?.trim() ?? ''

  return (
    <div className="space-y-8 pb-10">
      <section className="surface-card-strong p-8">
        <div className="eyebrow">Purchase confirmed</div>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
          Checkout returned to CO2 Router.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          Activation is handled on the live billing path. The status block below confirms whether
          the session completed and whether the organization was activated.
        </p>
      </section>

      {sessionId ? (
        <PurchaseStatusCard sessionId={sessionId} />
      ) : (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-5 text-sm text-rose-100">
          Missing Stripe session id. If checkout already completed, use the contact path and include
          your billing email so the team can trace the session.
        </div>
      )}

      <section className="flex flex-wrap gap-3">
        <Link
          href="/console"
          className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
        >
          Open Control Surface
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
        >
          Contact the team
        </Link>
      </section>
    </div>
  )
}
