'use client'

import { DecisionFlowDiagram } from '@/components/DecisionFlowDiagram'
import { ActionStrip } from '@/components/landing/ActionStrip'
import { CategoryDifferenceSection } from '@/components/landing/CategoryDifferenceSection'
import { DecisionExampleCard } from '@/components/landing/DecisionExampleCard'
import { FinalCTASection } from '@/components/landing/FinalCTASection'
import { HeroMotionSurface } from '@/components/landing/HeroMotionSurface'
import { LiveSystemSection } from '@/components/landing/LiveSystemSection'
import { PricingOrControlSection } from '@/components/landing/PricingOrControlSection'
import { ProofMoatSection } from '@/components/landing/ProofMoatSection'
import { SignalDoctrineSection } from '@/components/landing/SignalDoctrineSection'
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

  const heroDecision =
    overview.featuredDecision &&
    'decisionFrameId' in overview.featuredDecision &&
    !('decision' in overview.featuredDecision)
      ? overview.featuredDecision
      : overview.decisions[0] ?? null
  const featuredDecision =
    overview.featuredDecision && 'decision' in overview.featuredDecision
      ? overview.featuredDecision
      : overview.liveDecision
  const waterProviders = overview.providers.filter((provider) => provider.providerType === 'water')
  const verifiedWaterDatasets = waterProviders.filter(
    (provider) => provider.provenanceStatus === 'verified'
  ).length

  const proofContext = {
    governance:
      featuredDecision.policyTrace.profile ??
      featuredDecision.policyTrace.policyVersion ??
      'SAIQ governance attached',
    replay:
      overview.replay == null
        ? 'Stored frames support replay when persisted.'
        : overview.replay.deterministicMatch
          ? 'Replay currently returns a deterministic match.'
          : 'Replay is available for inspection on the frame.',
    provenance:
      waterProviders.length > 0
        ? `${verifiedWaterDatasets} verified water datasets are attached to the current authority path.`
        : 'Source lineage and water provenance are tracked on the decision frame.',
  }

  return (
    <div className="space-y-8 pb-8">
      <HeroMotionSurface liveDecision={heroDecision} />

      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300">
              What CO2 Router is
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              A pre-execution enforcement layer for serious infrastructure.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              CO2 Router authorizes compute before it runs. It evaluates carbon, water, latency,
              cost, and policy together, then returns one of five binding actions.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              That is the control point. The proof trail, policy state, and replay path follow the
              same governed record instead of being reconstructed later.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: 'Control Surface',
                body: 'The operator console for live authority, evidence, and system posture.',
              },
              {
                title: 'CI wedge',
                body: 'The first deployment path: authorize CI jobs before moving into runtime enforcement.',
              },
              {
                title: 'SAIQ governance',
                body: 'The doctrine layer that weighs carbon, water, latency, cost, and policy before execution.',
              },
              {
                title: 'Decision frame',
                body: 'The single record that binds the action, policy trace, and evidence to one execution event.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-white/8 bg-slate-950/60 p-5"
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-300">
                  {item.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Binding action set
          </div>
          <div className="mt-4">
            <ActionStrip distribution={overview.actionDistribution} />
          </div>
        </div>
      </section>

      <CategoryDifferenceSection />

      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <DecisionFlowDiagram />
      </section>

      <ProofMoatSection replay={overview.replay} />
      <DecisionExampleCard decision={featuredDecision} proofContext={proofContext} />
      <SignalDoctrineSection providers={overview.providers} />
      <PricingOrControlSection />
      <LiveSystemSection />
      <FinalCTASection />
    </div>
  )
}
