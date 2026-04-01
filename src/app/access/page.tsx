import Link from 'next/link'

import { CheckoutButton } from '@/components/commerce/CheckoutButton'

export default function AccessPage() {
  return (
    <div className="space-y-8 pb-10">
      <section className="surface-card-strong p-8">
        <div className="eyebrow">Access / Demo</div>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
          Start with one real governed lane.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          The right launch path is narrow: one workflow, one control point, one proof trail, and a
          clear buying reason. The pilot is paid and temporary. Design-partner intake remains open
          for teams that are not ready to buy yet.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <div className="eyebrow">Pilot / Shadow Mode</div>
          <h2 className="mt-3 text-3xl font-semibold text-white">$250 / 30 days</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Scoped, temporary, and built to prove the CI wedge plus decision-proof path under a
            live workload.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CheckoutButton
              lane="pilot"
              label="Start $250 Pilot"
              className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
            />
            <Link
              href="/pricing"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Review segmented pricing
            </Link>
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="eyebrow">Design partner</div>
          <h2 className="mt-3 text-3xl font-semibold text-white">Apply without paying first.</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Use the design-partner lane if you need a scoped evaluation but cannot move directly
            into payment yet. That intake still routes to the same monitored operating inbox.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/design-partners"
              className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Apply as design partner
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Contact the team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
