import type { Metadata } from 'next'

import { InformationPageShell } from '@/components/site/InformationPageShell'
import { formatClaimForPublication, getFeaturedClaimsForSurface } from '@/lib/claims'
import {
  maturityStateLabels,
  maturityStateOrder,
  publicMaturityLanes,
} from '@/lib/control-surface/maturity'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Roadmap',
  description:
    'Public maturity roadmap for CO2 Router across the CI wedge, control surface, proof/replay, doctrine/governance, and runtime adapters.',
  path: '/company/roadmap',
  keywords: ['CO2 Router roadmap', 'CI wedge maturity', 'proof replay roadmap'],
})

export default function CompanyRoadmapPage() {
  const roadmapClaims = getFeaturedClaimsForSurface('roadmap')
  const roadmapLanes = maturityStateOrder.map((state) => ({
    state,
    label: maturityStateLabels[state],
    items: publicMaturityLanes.filter((lane) => lane.state === state),
  }))

  return (
    <InformationPageShell
      eyebrow="Company / Roadmap"
      title="Public maturity roadmap."
      summary="This page distinguishes what is production-ready, strongest today, on the roadmap, and still experimental. It is meant to increase trust, not blur reality."
      secondaryHref="/status"
      secondaryLabel="View Status"
    >
      <section className="grid gap-4 xl:grid-cols-4">
        {roadmapLanes.map((lane) => (
          <article
            key={lane.state}
            className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">{lane.label}</div>
            <div className="mt-5 space-y-5">
              {lane.items.map((item) => (
                <div key={item.label} className="border-t border-white/10 pt-4">
                  <h2 className="text-xl font-bold text-white">{item.label}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
        <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
          Claim discipline
        </div>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
          Public maturity only means something if the claims stay certified.
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {roadmapClaims.map((claim) => (
            <article
              key={claim.id}
              className="rounded-[22px] border border-white/8 bg-slate-950/55 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-300">
                  {claim.status}
                </div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  {claim.evidenceSource}
                </div>
              </div>
              <div className="mt-3 text-lg font-semibold text-white">
                {formatClaimForPublication(claim)}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{claim.support}</p>
            </article>
          ))}
        </div>
      </section>
    </InformationPageShell>
  )
}
