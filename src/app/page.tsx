'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { format, formatDistanceStrict } from 'date-fns'
import { ArrowRight, Check, Clock3, Cpu, DollarSign, GitBranch, ShieldCheck, Zap } from 'lucide-react'

import { CO2RouterLogo } from '@/components/CO2RouterLogo'
import type { MethodologyProviders } from '@/types'

type DemoResponse = {
  workloadType: string
  baselineRegion: string
  baselineCarbonIntensity: number
  baselineEstimatedCost: number
  selectedRegion: string
  selectedCarbonIntensity: number
  selectedEstimatedCost: number
  carbonSavingsPct: number
  costSavingsPct: number
  recommendedDelaySeconds: number
  recommendedDelayWindow: {
    startTime: string
    endTime: string
  } | null
  confidence: number
  explanation: string
  policyMode: 'optimize'
  providers: {
    sourceUsed: string | null
    validationSource: string | null
    fallbackUsed: boolean
    qualityTier: 'high' | 'medium' | 'low'
  }
  alternatives: Array<{
    region: string
    carbonIntensity: number
    estimatedCost: number
    score: number
  }>
  decisionId: string | null
  generatedAt: string
}

const demoScenarios = [
  {
    id: 'build',
    label: 'Build pipeline',
    summary: 'Node build + test on a standard CI lane.',
    candidateRegions: ['eastus', 'westus2', 'northeurope', 'norwayeast'],
    baselineRegion: 'eastus',
    canDelay: true,
  },
  {
    id: 'test',
    label: 'Integration matrix',
    summary: 'Heavier matrix job with multiple shards.',
    candidateRegions: ['eastus', 'westus2', 'northeurope', 'norwayeast'],
    baselineRegion: 'eastus',
    canDelay: true,
  },
  {
    id: 'batch',
    label: 'Nightly batch',
    summary: 'Scheduled data processing with window flexibility.',
    candidateRegions: ['eastus', 'westus2', 'northeurope', 'norwayeast'],
    baselineRegion: 'eastus',
    canDelay: true,
  },
] as const

const pricingTiers = [
  {
    name: 'Starter',
    price: '$49',
    blurb: 'Fast CI routing wedge for smaller teams.',
    features: ['5,000 routed jobs', 'GitHub Action integration', 'Savings proof output'],
  },
  {
    name: 'Growth',
    price: '$199',
    blurb: 'Routing and timing control for production workloads.',
    features: ['50,000 routed jobs', 'Delay optimization', 'Advanced reporting + API access'],
  },
  {
    name: 'Scale',
    price: '$599+',
    blurb: 'Control-plane fit for larger estates and compliance work.',
    features: ['Unlimited jobs', 'Multi-region orchestration', 'Priority support + export surfaces'],
  },
]

function formatUsd(value: number) {
  return `$${value.toFixed(2)}`
}

function formatDelay(delaySeconds: number, window: DemoResponse['recommendedDelayWindow']) {
  if (!delaySeconds || !window) return 'Run now'
  return `${formatDistanceStrict(Date.now(), new Date(window.startTime))} until ${format(
    new Date(window.startTime),
    'MMM d, h:mm a'
  )}`
}

export default function LandingPage() {
  const [scenarioId, setScenarioId] = useState<(typeof demoScenarios)[number]['id']>('build')
  const [demoRunNonce, setDemoRunNonce] = useState(0)
  const [demo, setDemo] = useState<DemoResponse | null>(null)
  const [demoLoading, setDemoLoading] = useState(true)
  const [demoError, setDemoError] = useState<string | null>(null)
  const [providers, setProviders] = useState<MethodologyProviders['providers']>([])

  const scenario = useMemo(
    () => demoScenarios.find((entry) => entry.id === scenarioId) ?? demoScenarios[0],
    [scenarioId]
  )

  useEffect(() => {
    let active = true

    async function loadProviderHealth() {
      try {
        const response = await fetch('/api/providers/health', { cache: 'no-store' })
        if (!response.ok) return
        const data = (await response.json()) as MethodologyProviders
        if (active) setProviders(data.providers ?? [])
      } catch {
        // Keep the page resilient even if provider health is unavailable.
      }
    }

    void loadProviderHealth()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    async function runDemo() {
      try {
        setDemoLoading(true)
        setDemoError(null)

        const response = await fetch('/api/demo/route', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            workloadType: scenario.id,
            candidateRegions: scenario.candidateRegions,
            baselineRegion: scenario.baselineRegion,
            canDelay: scenario.canDelay,
            carbonSensitivity: 0.68,
            costSensitivity: 0.2,
            latencySensitivity: 0.12,
          }),
        })

        const data = (await response.json()) as DemoResponse | { error: string }

        if (!response.ok) {
          throw new Error('error' in data ? data.error : 'Unable to compute demo decision')
        }

        if (active) setDemo(data as DemoResponse)
      } catch (error) {
        if (active) {
          setDemoError(error instanceof Error ? error.message : 'Unable to compute demo decision')
          setDemo(null)
        }
      } finally {
        if (active) setDemoLoading(false)
      }
    }

    void runDemo()

    return () => {
      active = false
    }
  }, [scenario, demoRunNonce])

  const providerSummary = useMemo(() => {
    const healthy = providers.filter((provider) => provider.status === 'healthy').length
    return {
      healthy,
      total: providers.length,
    }
  }, [providers])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_32%),radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_28%),#020617] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <CO2RouterLogo size="md" />
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#demo" className="text-sm text-slate-400 transition hover:text-white">
              Live Demo
            </a>
            <a href="#how" className="text-sm text-slate-400 transition hover:text-white">
              How It Works
            </a>
            <a href="#pricing" className="text-sm text-slate-400 transition hover:text-white">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/console"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              Console
            </Link>
            <a
              href="#demo"
              className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              See Live Demo
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 pulse-glow" />
              Compute optimization control plane
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl font-[var(--font-display)] text-5xl font-semibold leading-[0.94] text-white md:text-7xl">
                Stop wasting money on inefficient compute.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                CO2 Router decides where and when workloads run, reducing compute waste, lowering emissions,
                and generating audit-ready proof automatically.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                See Live Demo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#github"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 px-6 py-3 font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900/70"
              >
                Connect GitHub
                <GitBranch className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <HeroMetric label="Routing latency" value="< 1s" detail="Decision surface tuned for CI/CD" />
              <HeroMetric
                label="Signal fabric"
                value={`${providerSummary.healthy}/${providerSummary.total || 4}`}
                detail="Healthy live providers in the current build"
              />
              <HeroMetric label="Proof output" value="Audit-ready" detail="Decision explanation + provenance preserved" />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-slate-950/70 p-6 shadow-[0_30px_100px_rgba(2,6,23,0.65)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Execution preview</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Control-plane decision</h2>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                live
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">Default execution</p>
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-500">baseline</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MetricPair label="Region" value={demo?.baselineRegion ?? scenario.baselineRegion} />
                  <MetricPair
                    label="Carbon"
                    value={demo ? `${demo.baselineCarbonIntensity.toFixed(0)} gCO2/kWh` : '...'}
                  />
                  <MetricPair
                    label="Cost"
                    value={demo ? formatUsd(demo.baselineEstimatedCost) : '...'}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-emerald-100">CO2 Router decision</p>
                  <span className="text-xs uppercase tracking-[0.18em] text-emerald-200">optimized</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MetricPair label="Region" value={demo?.selectedRegion ?? '...'} />
                  <MetricPair
                    label="Carbon"
                    value={demo ? `${demo.selectedCarbonIntensity.toFixed(0)} gCO2/kWh` : '...'}
                  />
                  <MetricPair
                    label="Cost"
                    value={demo ? formatUsd(demo.selectedEstimatedCost) : '...'}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <SignalCard
                  label="Carbon savings"
                  value={demo ? `${demo.carbonSavingsPct.toFixed(1)}%` : '--'}
                  icon={Zap}
                />
                <SignalCard
                  label="Cost savings"
                  value={demo ? `${demo.costSavingsPct.toFixed(1)}%` : '--'}
                  icon={DollarSign}
                />
                <SignalCard
                  label="Confidence"
                  value={demo ? `${Math.round(demo.confidence * 100)}%` : '--'}
                  icon={ShieldCheck}
                />
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">Delay recommendation</p>
                  <Clock3 className="h-4 w-4 text-slate-500" />
                </div>
                <p className="mt-3 text-lg font-semibold text-white">
                  {demo ? formatDelay(demo.recommendedDelaySeconds, demo.recommendedDelayWindow) : 'Calculating...'}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {demo?.explanation ?? 'Evaluating live signals and current workload posture.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800/70 bg-slate-950/55">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-3">
            <FeatureCard
              eyebrow="The problem"
              title="CI jobs are running in the wrong place at the wrong time."
              body="Default regions are easy, not efficient. That leaves wasted spend, dirtier execution windows, and no proof that better decisions were available."
            />
            <FeatureCard
              eyebrow="The shift"
              title="We do not analyze compute. We control it."
              body="Workflows ask CO2 Router, the engine evaluates region and timing, and the downstream executor runs with a defensible decision in hand."
            />
            <FeatureCard
              eyebrow="The proof"
              title="Every decision leaves an audit trail."
              body="Baseline vs selected, source quality, confidence, and alternatives stay attached to the decision so operators can replay and explain outcomes later."
            />
          </div>
        </section>

        <section id="how" className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">How it works</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">A deterministic decision layer in front of execution.</h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-5">
            {[
              'Workflow asks CO2 Router.',
              'Signal fabric evaluates candidate regions and time windows.',
              'Scoring engine balances carbon, cost, latency, and confidence.',
              'Policy layer returns the best executable decision.',
              'Decision proof is stored for replay, reporting, and assurance.',
            ].map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Step {index + 1}</p>
                <p className="mt-4 text-base leading-7 text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="demo" className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="rounded-[28px] border border-slate-800 bg-slate-950/65 p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Live demo</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Run the routing wedge against real logic.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                This demo is powered by the actual routing engine. It compares a baseline region against the optimized decision and keeps the proof surface visible.
              </p>

              <div className="mt-8 space-y-3">
                {demoScenarios.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setScenarioId(entry.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                      scenarioId === entry.id
                        ? 'border-emerald-400/40 bg-emerald-400/10'
                        : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                    }`}
                  >
                    <p className="font-semibold text-white">{entry.label}</p>
                    <p className="mt-1 text-sm text-slate-400">{entry.summary}</p>
                  </button>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">GitHub Action wedge</p>
                <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 px-4 py-4 text-sm text-emerald-200">
{`- name: Route with CO2 Router
  uses: co2router/action@v1
  with:
    workload-type: ${scenario.id}
    candidate-regions: ${scenario.candidateRegions.join(',')}`}
                </pre>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-800 bg-slate-950/65 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Before / after</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{scenario.label}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDemoRunNonce((current) => current + 1)}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  Refresh
                </button>
              </div>

              {demoLoading && (
                <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-sm text-slate-400">
                  Computing live routing decision...
                </div>
              )}

              {demoError && (
                <div className="mt-12 rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-sm text-red-300">
                  {demoError}
                </div>
              )}

              {demo && (
                <div className="mt-8 space-y-6">
                  <div className="grid gap-4 xl:grid-cols-2">
                    <DemoCard
                      title="Default"
                      badge="baseline"
                      region={demo.baselineRegion}
                      carbon={demo.baselineCarbonIntensity}
                      cost={demo.baselineEstimatedCost}
                    />
                    <DemoCard
                      title="CO2 Router"
                      badge="selected"
                      region={demo.selectedRegion}
                      carbon={demo.selectedCarbonIntensity}
                      cost={demo.selectedEstimatedCost}
                      highlighted
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <SummaryChip label="Carbon delta" value={`${demo.carbonSavingsPct.toFixed(1)}%`} />
                    <SummaryChip label="Cost delta" value={`${demo.costSavingsPct.toFixed(1)}%`} />
                    <SummaryChip label="Confidence" value={`${Math.round(demo.confidence * 100)}%`} />
                    <SummaryChip label="Delay window" value={formatDelay(demo.recommendedDelaySeconds, demo.recommendedDelayWindow)} />
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-400">Why this decision won</p>
                      <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
                        {demo.providers.qualityTier}
                      </span>
                    </div>
                    <p className="mt-3 text-base leading-7 text-slate-200">{demo.explanation}</p>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <ProviderFact label="Signal source" value={demo.providers.sourceUsed ?? 'unknown'} />
                      <ProviderFact label="Validation" value={demo.providers.validationSource ?? 'none'} />
                      <ProviderFact label="Fallback" value={demo.providers.fallbackUsed ? 'yes' : 'no'} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Alternatives considered</p>
                    <div className="mt-4 space-y-3">
                      {demo.alternatives.slice(0, 4).map((alternative) => (
                        <div key={alternative.region} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                          <div>
                            <p className="font-medium text-white">{alternative.region}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {alternative.carbonIntensity.toFixed(0)} gCO2/kWh • {formatUsd(alternative.estimatedCost)}
                            </p>
                          </div>
                          <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            score {alternative.score.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid gap-6 lg:grid-cols-3">
            <FeatureCard
              eyebrow="Trust"
              title="Multi-provider intelligence"
              body="Routing decisions are grounded in WattTime, GridStatus, EIA-backed telemetry, Ember baselines, and explicit source metadata."
            />
            <FeatureCard
              eyebrow="Proof"
              title="Replayable decisions"
              body="Every decision keeps its baseline, selected region, confidence, and alternatives close so operators can prove that execution was better, not just different."
            />
            <FeatureCard
              eyebrow="Control"
              title="Policy-aware execution"
              body="Optimize mode moves fast for operators. Assurance mode keeps the signal doctrine conservative when defensibility matters more than chasing the lowest number."
            />
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-6 pb-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Pricing</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">Start with CI. Expand into broader execution control.</h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div key={tier.name} className="rounded-[28px] border border-slate-800 bg-slate-950/65 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{tier.name}</p>
                    <p className="mt-4 text-4xl font-semibold text-white">{tier.price}</p>
                    <p className="mt-1 text-sm text-slate-400">per month</p>
                  </div>
                  <Cpu className="h-5 w-5 text-emerald-300" />
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-400">{tier.blurb}</p>
                <div className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-slate-200">
                      <Check className="h-4 w-4 text-emerald-300" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="github" className="border-t border-slate-800/70 bg-slate-950/70">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">GitHub Actions wedge</p>
              <h2 className="mt-4 text-4xl font-semibold text-white">Start optimizing your compute in 5 minutes.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Call CO2 Router from a workflow, receive a real routing decision, and expose the result to the rest of the job. Cost reduction comes first. Carbon reduction ships with proof.
              </p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-slate-950 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.45)]">
              <pre className="overflow-x-auto text-sm text-emerald-200">
{`- name: Route with CO2 Router
  uses: co2router/action@v1
  with:
    engine-url: \${{ secrets.ECOBE_URL }}
    api-key: \${{ secrets.ECOBE_INTERNAL_API_KEY }}
    workload-id: ci-build
    candidate-regions: eastus,northeurope,norwayeast`}
              </pre>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function HeroMetric({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  )
}

function FeatureCard({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-950/60 p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>
      <h3 className="mt-4 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-400">{body}</p>
    </div>
  )
}

function MetricPair({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/65 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  )
}

function SignalCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof Zap
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <Icon className="h-4 w-4 text-emerald-300" />
      </div>
      <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}

function DemoCard({
  title,
  badge,
  region,
  carbon,
  cost,
  highlighted = false,
}: {
  title: string
  badge: string
  region: string
  carbon: number
  cost: number
  highlighted?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlighted
          ? 'border-emerald-400/30 bg-emerald-400/10'
          : 'border-slate-800 bg-slate-900/80'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-white">{title}</p>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
          {badge}
        </span>
      </div>
      <div className="mt-5 space-y-3">
        <MetricPair label="Region" value={region} />
        <MetricPair label="Carbon intensity" value={`${carbon.toFixed(0)} gCO2/kWh`} />
        <MetricPair label="Estimated cost" value={formatUsd(cost)} />
      </div>
    </div>
  )
}

function SummaryChip({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-xl font-semibold text-white">{value}</p>
    </div>
  )
}

function ProviderFact({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  )
}
