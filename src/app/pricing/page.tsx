import Link from 'next/link'

import { CheckoutButton } from '@/components/commerce/CheckoutButton'

const segments = [
  {
    key: 'small',
    name: 'Small',
    cloudSpend: '$25k-$75k cloud spend',
    ci: '$400/mo',
    controlSurface: '$2,000/mo',
    enterprise: '$60,000/yr',
  },
  {
    key: 'mid',
    name: 'Mid',
    cloudSpend: '$75k-$250k cloud spend',
    ci: '$800/mo',
    controlSurface: '$4,000/mo',
    enterprise: '$120,000/yr',
    highlight: true,
  },
  {
    key: 'large',
    name: 'Large',
    cloudSpend: '$250k-$500k+ cloud spend',
    ci: '$1,500/mo',
    controlSurface: '$7,000/mo',
    enterprise: '$200,000/yr',
  },
] as const

export default function PricingPage() {
  return (
    <div className="space-y-8 pb-10">
      <section className="surface-card-strong p-8">
        <div className="eyebrow">Pricing</div>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
          Segmented land-and-expand pricing tied to cloud spend.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          CO2 Router is sold as execution approval infrastructure. The first sale is an enforcement
          path, not a dashboard seat model. Commercial expansion follows control depth and runtime
          authority.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {segments.map((segment) => (
          <div
            key={segment.name}
            className={`surface-card flex h-full flex-col p-6 ${
              'highlight' in segment && segment.highlight ? 'border-cyan-300/30 bg-cyan-300/[0.06]' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="eyebrow">{segment.name}</div>
              <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 font-mono text-[11px] text-slate-300">
                {segment.cloudSpend}
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                { label: 'CI', price: segment.ci, detail: 'Pipeline authorization and proof' },
                {
                  label: 'Control Surface',
                  price: segment.controlSurface,
                  detail: 'Live authority, MSS posture, and operator visibility',
                },
                {
                  label: 'Enterprise',
                  price: segment.enterprise,
                  detail: 'Production rollout with policy adapters and enforcement',
                },
              ].map((line) => (
                <div
                  key={line.label}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-300"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
                      {line.label}
                    </div>
                    <div className="font-mono text-sm text-cyan-200">{line.price}</div>
                  </div>
                  <div className="mt-2">{line.detail}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3">
              <CheckoutButton
                lane="ci"
                segment={segment.key}
                label="Buy CI"
                className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
              />
              <CheckoutButton
                lane="control_surface"
                segment={segment.key}
                label="Buy Control Surface"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-70"
              />
              <CheckoutButton
                lane="enterprise"
                segment={segment.key}
                label="Buy Enterprise"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-black/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>
          </div>
        ))}
      </section>

      <section className="surface-card p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Pilot / Shadow Mode</div>
            <h2 className="mt-3 text-3xl font-semibold text-white">$250 / 30 days</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Scoped, temporary only. Use this to prove the CI wedge and decision proof path under
              live workloads without turning the pilot into an indefinite free branch.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-slate-300">
            scoped / temporary only
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <CheckoutButton
            lane="pilot"
            label="Start $250 Pilot"
            className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
          />
          <Link
            href="/design-partners"
            className="inline-flex rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/5"
          >
            Apply as design partner
          </Link>
        </div>
      </section>

      <section className="surface-card p-8">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="eyebrow">Commercial model</div>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Package the control plane around enforcement depth.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-slate-300">
              <div className="text-base font-semibold text-white">Entry path</div>
              Start with the CI wedge and one proof trail that the team can inspect under real
              runtime conditions.
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-slate-300">
              <div className="text-base font-semibold text-white">Scaling logic</div>
              Expansion follows enforcement coverage, adapter depth, and governance requirements,
              not dashboard seat count.
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


