import type { Metadata } from 'next'

import { InformationPageShell } from '@/components/site/InformationPageShell'
import { createPageMetadata } from '@/lib/seo'

const roadmapLanes = [
  {
    state: 'Production-ready',
    items: [
      {
        title: 'CI wedge',
        detail:
          'Pre-execution authorization, deterministic action output, and canonical decision persistence are active now.',
      },
    ],
  },
  {
    state: 'Strongest today',
    items: [
      {
        title: 'Control surface',
        detail:
          'The operator surface is strongest today for live decision review, provider posture, proof visibility, and replay inspection.',
      },
      {
        title: 'Proof / replay',
        detail:
          'Decision frames, trace-backed replay, and exportable proof packets are already part of the live evaluation path.',
      },
    ],
  },
  {
    state: 'Roadmap',
    items: [
      {
        title: 'Doctrine / governance',
        detail:
          'The current pass expands why-not explanations, trust contracts, and public doctrine visibility without weakening the canonical engine.',
      },
    ],
  },
  {
    state: 'Experimental',
    items: [
      {
        title: 'Runtime adapters',
        detail:
          'Adapter breadth is real but still uneven by runtime. The public claim stays bounded until each wedge reaches stable operator quality.',
      },
    ],
  },
] as const

export const metadata: Metadata = createPageMetadata({
  title: 'Roadmap',
  description:
    'Public maturity roadmap for CO2 Router across the CI wedge, control surface, proof/replay, doctrine/governance, and runtime adapters.',
  path: '/company/roadmap',
  keywords: ['CO2 Router roadmap', 'CI wedge maturity', 'proof replay roadmap'],
})

export default function CompanyRoadmapPage() {
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
            <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">{lane.state}</div>
            <div className="mt-5 space-y-5">
              {lane.items.map((item) => (
                <div key={item.title} className="border-t border-white/10 pt-4">
                  <h2 className="text-xl font-bold text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </InformationPageShell>
  )
}
