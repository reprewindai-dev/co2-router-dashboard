'use client'

import { HeroMotionSurface } from '@/components/landing/HeroMotionSurface'
import { ActionStrip } from '@/components/landing/ActionStrip'
import { DecisionExampleCard } from '@/components/landing/DecisionExampleCard'
import { CategoryDifferenceSection } from '@/components/landing/CategoryDifferenceSection'
import { ProofMoatSection } from '@/components/landing/ProofMoatSection'
import { SignalDoctrineSection } from '@/components/landing/SignalDoctrineSection'
import { PricingOrControlSection } from '@/components/landing/PricingOrControlSection'
import { FinalCTASection } from '@/components/landing/FinalCTASection'
import { LiveSystemSection } from '@/components/landing/LiveSystemSection'
import { useControlSurfaceOverview } from '@/lib/hooks/control-surface'

export default function LandingPage() {
  const overviewQuery = useControlSurfaceOverview()
  const overview = overviewQuery.data

  if (overviewQuery.isLoading) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-sm text-slate-300">
        Loading CO2 Router...
      </div>
    )
  }

  if (overviewQuery.error || !overview) {
    return (
      <div className="rounded-[32px] border border-rose-400/20 bg-rose-400/10 p-8 text-sm text-rose-200">
        {overviewQuery.error instanceof Error
          ? overviewQuery.error.message
          : 'Failed to load CO2 Router'}
      </div>
    )
  }

  const liveStrip = [...overview.decisions]
    .sort((a, b) => (b.carbonReductionPct + b.waterImpactDeltaLiters) - (a.carbonReductionPct + a.waterImpactDeltaLiters))
    .slice(0, 3)
  const heroDecision =
    overview.featuredDecision && 'decisionFrameId' in overview.featuredDecision && !('decision' in overview.featuredDecision)
      ? overview.featuredDecision
      : overview.decisions[0] ?? null
  const featuredDecision =
    overview.featuredDecision && 'decision' in overview.featuredDecision
      ? overview.featuredDecision
      : overview.liveDecision

  return (
    <div className="space-y-8 pb-8">
      <HeroMotionSurface liveDecision={heroDecision} />

      <section className="grid gap-3 lg:grid-cols-3">
        {liveStrip.map((decision) => (
          <div
            key={decision.decisionFrameId}
            className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              live decision
            </div>
            <div className="mt-2 text-lg font-semibold text-white">{decision.workloadLabel}</div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-white/[0.04] px-2 py-1">{decision.action}</span>
              <span className="rounded-full bg-white/[0.04] px-2 py-1">{decision.selectedRegion}</span>
              <span className="rounded-full bg-white/[0.04] px-2 py-1">
                {decision.carbonReductionPct.toFixed(1)}% carbon delta
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300">What it does</div>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            You do not optimize infrastructure anymore.
            <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              You control it.
            </span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
            A workload asks to run. CO2 Router co-evaluates carbon, water, latency, and cost.
            SAIQ governance and policy constraints return one of five binding actions before
            execution. The executor follows the decision. Proof, trace, and replay are recorded
            against the same frame.
          </p>
        </div>
        <div className="mt-8">
          <ActionStrip distribution={overview.actionDistribution} />
        </div>
      </section>

      <DecisionExampleCard decision={featuredDecision} />

      <CategoryDifferenceSection />

      <ProofMoatSection replay={overview.replay} />
      <SignalDoctrineSection providers={overview.providers} />
      <PricingOrControlSection />
      <FinalCTASection />
      <LiveSystemSection />
    </div>
  )
}
