'use client'

import Link from 'next/link'

const spendBands = [
  {
    name: 'Small',
    spend: '$25k-$75k cloud spend',
    ci: '$400/mo',
    controlSurface: '$2,000/mo',
    enterprise: '$60,000/yr',
    highlight: false,
  },
  {
    name: 'Mid',
    spend: '$75k-$250k cloud spend',
    ci: '$800/mo',
    controlSurface: '$4,000/mo',
    enterprise: '$120,000/yr',
    highlight: true,
  },
  {
    name: 'Large',
    spend: '$250k-$500k+ cloud spend',
    ci: '$1,500/mo',
    controlSurface: '$7,000/mo',
    enterprise: '$200,000/yr',
    highlight: false,
  },
] as const

export function PricingOrControlSection() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.28em] text-emerald-300">
          Pricing / rollout
        </div>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
          Start with the CI wedge. Expand into execution authority.
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
          The CI wedge is the first commercial path. The Control Surface is the operator console.
          Enterprise rollout extends the same governed decision model into broader enforcement.
        </p>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        {spendBands.map((band) => (
          <div
            key={band.name}
            className={`rounded-[28px] border p-6 ${
              band.highlight
                ? 'border-cyan-300/24 bg-cyan-300/8 shadow-[0_18px_80px_rgba(34,211,238,0.12)]'
                : 'border-white/8 bg-slate-950/55'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                {band.name}
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] tracking-[0.08em] text-slate-400">
                {band.spend}
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                { label: 'CI wedge', price: band.ci, note: 'Pipeline authorization and governed proof.' },
                {
                  label: 'Control Surface',
                  price: band.controlSurface,
                  note: 'Live operator view for authority, evidence, and posture.',
                },
                {
                  label: 'Enterprise rollout',
                  price: band.enterprise,
                  note: 'Broader policy and enforcement expansion around the same decision model.',
                },
              ].map((line) => (
                <div
                  key={line.label}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                      {line.label}
                    </div>
                    <div className="font-mono text-sm tracking-[0.08em] text-cyan-100">
                      {line.price}
                    </div>
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-300">{line.note}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[28px] border border-emerald-300/18 bg-emerald-300/[0.08] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-emerald-200">
              Pilot / Shadow Mode
            </div>
            <div className="mt-2 text-2xl font-bold text-white">$250 / 30 days</div>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] tracking-[0.08em] text-slate-300">
            scoped / temporary only
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/access"
          className="rounded-2xl bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-950"
        >
          Request pilot
        </Link>
        <Link
          href="/methodology"
          className="rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white"
        >
          View methodology
        </Link>
      </div>
    </section>
  )
}
