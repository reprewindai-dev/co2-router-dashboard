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
  const trustContract = featuredDecision.decisionTrust
  const explanation = featuredDecision.decisionExplanation

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

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-white/8 bg-slate-950/45 p-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">
              Operator trust contract
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Freshness</div>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {trustContract?.signalFreshness.freshnessSummary ??
                    'Freshness posture is attached per decision frame.'}
                </p>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Provider trust</div>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {trustContract
                    ? `${trustContract.providerTrust.providerTrustTier} trust tier with ${trustContract.providerTrust.carbonProvider} on the selected path.`
                    : 'Provider trust tier is carried with the selected path.'}
                </p>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Counterfactual</div>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {explanation?.counterfactualCondition ??
                    'Each frame records what would have needed to change for the engine to decide differently.'}
                </p>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Uncertainty</div>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {explanation?.uncertaintySummary ??
                    'Signal uncertainty is exposed directly instead of being hidden behind confidence theater.'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-slate-950/45 p-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">
              Public maturity
            </div>
            <div className="mt-4 space-y-3">
              {overview.maturity.map((lane) => (
                <div
                  key={lane.label}
                  className="flex items-start justify-between gap-4 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{lane.label}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{lane.detail}</p>
                  </div>
                  <div className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-300">
                    {lane.state.replace(/_/g, ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
              Buyer scenarios
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              Concrete workloads, not abstract sustainability talk.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            These are the first motions the product is built to handle credibly today: CI authorization,
            regulated placement, and protected critical execution.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {overview.buyerScenarios.map((scenario) => (
            <article
              key={scenario.title}
              className="rounded-[24px] border border-white/8 bg-slate-950/50 p-5"
            >
              <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">
                {scenario.workloadClass}
              </div>
              <h3 className="mt-3 text-xl font-bold text-white">{scenario.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{scenario.operatorOutcome}</p>
              <div className="mt-4 border-t border-white/10 pt-4 text-sm leading-7 text-slate-400">
                {scenario.proofPosture}
              </div>
            </article>
          ))}
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
