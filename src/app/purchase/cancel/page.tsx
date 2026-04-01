import Link from 'next/link'

export default function PurchaseCancelPage({
  searchParams,
}: {
  searchParams: { lane?: string; segment?: string }
}) {
  return (
    <div className="space-y-8 pb-10">
      <section className="surface-card-strong p-8">
        <div className="eyebrow">Checkout cancelled</div>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
          No entitlement was activated.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          Stripe returned without completing payment, so CO2 Router did not activate access for the
          selected offer.
          {searchParams.lane ? ` Selected lane: ${searchParams.lane}.` : ''}
          {searchParams.segment ? ` Segment: ${searchParams.segment}.` : ''}
        </p>
      </section>

      <section className="flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
        >
          Return to pricing
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
