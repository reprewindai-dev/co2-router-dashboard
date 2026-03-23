'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { CO2RouterLogo } from '@/components/CO2RouterLogo'
import { ecobeApi, type GreenRoutingRequest } from '@/lib/api'

const REGION_NAMES: Record<string, string> = {
  'us-east-1': 'US East',
  'us-west-2': 'US West',
  'eu-west-1': 'Ireland',
  'eu-central-1': 'Frankfurt',
  'ap-southeast-1': 'Singapore',
  'ap-northeast-1': 'Tokyo',
}

type RegionDisplay = {
  id: string
  name: string
  carbon: number
  renewable: number
  ramp: number
  signalQuality: string
}

type DecisionState = Record<string, unknown> | null

const scenarios = [
  {
    label: 'Inference burst',
    workloadType: 'AI Inference Burst',
    description: 'Latency-sensitive burst traffic with a 20 minute execution budget.',
    durationMinutes: 20,
    mode: 'optimize' as const,
    policyMode: 'default' as const,
  },
  {
    label: 'Training lease',
    workloadType: 'GPU Training Lease',
    description: 'Delay-tolerant training run where carbon reduction beats raw immediacy.',
    durationMinutes: 180,
    mode: 'assurance' as const,
    policyMode: 'sec_disclosure_strict' as const,
  },
  {
    label: 'Disclosure export',
    workloadType: 'Audit-Ready Batch',
    description: 'Assurance-grade routing for customers who need traceable disclosure records.',
    durationMinutes: 90,
    mode: 'assurance' as const,
    policyMode: 'eu_24x7_ready' as const,
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function toSparklinePoints(values: number[]) {
  if (values.length === 0) return ''
  const max = Math.max(...values)
  const min = Math.min(...values)
  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 320
      const normalized = max === min ? 0.5 : (value - min) / (max - min)
      const y = 130 - normalized * 92
      return `${x},${y}`
    })
    .join(' ')
}

function qualityTone(qualityTier?: unknown) {
  const tier = typeof qualityTier === 'string' ? qualityTier.toLowerCase() : ''
  if (tier.includes('high') || tier.includes('strong')) return 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10'
  if (tier.includes('medium')) return 'text-amber-200 border-amber-400/30 bg-amber-500/10'
  return 'text-sky-200 border-sky-400/30 bg-sky-500/10'
}

export default function LandingPage() {
  const [regions, setRegions] = useState<RegionDisplay[]>([])
  const [activeScenario, setActiveScenario] = useState(0)
  const [decision, setDecision] = useState<DecisionState>(null)
  const [decisionError, setDecisionError] = useState<string | null>(null)
  const [routing, setRouting] = useState(false)
  const [loadingSignals, setLoadingSignals] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadSignals() {
      try {
        const summary = await ecobeApi.getGridSummary()
        if (cancelled) return

        const mapped = (summary?.regions ?? []).map((region: any) => ({
          id: region.region,
          name: REGION_NAMES[region.region] ?? region.region,
          carbon: Math.round(region.carbonIntensity ?? 0),
          renewable: Math.round((region.renewableRatio ?? 0) * 100),
          ramp: Math.round(region.demandRampPct ?? 0),
          signalQuality:
            region.signalQuality ?? region.signal_quality ?? region.dataQuality ?? 'stable',
        }))

        setRegions(mapped)
      } catch (error) {
        if (!cancelled) {
          setDecisionError(
            error instanceof Error ? error.message : 'Live signal layer is unavailable.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingSignals(false)
        }
      }
    }

    loadSignals()
    return () => {
      cancelled = true
    }
  }, [])

  const averageCarbon = useMemo(() => {
    if (regions.length === 0) return null
    return Math.round(regions.reduce((sum, region) => sum + region.carbon, 0) / regions.length)
  }, [regions])

  const cleanestRegion = useMemo(() => {
    return [...regions].sort((a, b) => a.carbon - b.carbon)[0] ?? null
  }, [regions])

  const sparkline = useMemo(() => {
    return toSparklinePoints(regions.map((region) => region.carbon || 0))
  }, [regions])

  async function handleRouteGreen() {
    if (regions.length === 0) return

    const scenario = scenarios[activeScenario]
    const request: GreenRoutingRequest = {
      preferredRegions: regions.map((region) => region.id),
      durationMinutes: scenario.durationMinutes,
      mode: scenario.mode,
      policyMode: scenario.policyMode,
      carbonWeight: scenario.mode === 'assurance' ? 0.6 : 0.45,
      latencyWeight: scenario.mode === 'assurance' ? 0.15 : 0.35,
      costWeight: 0.25,
    }

    setRouting(true)
    setDecisionError(null)

    try {
      const result = await ecobeApi.routeGreen(request)
      setDecision({
        ...result,
        scenario: scenario.workloadType,
      })
    } catch (error) {
      setDecision(null)
      setDecisionError(error instanceof Error ? error.message : 'Routing failed.')
    } finally {
      setRouting(false)
    }
  }

  return (
    <div className="space-y-16 pb-10">
      <section className="relative overflow-hidden rounded-[32px] border border-slate-800/80 bg-slate-950/65 px-6 py-10 shadow-[0_24px_80px_rgba(2,6,23,0.55)] md:px-10 md:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.16),transparent_24%),radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.16),transparent_24%)]" />
        <div className="relative grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 pulse-glow" />
              Live command surface for carbon routing, assurance, and disclosure.
            </div>

            <div className="space-y-5">
              <CO2RouterLogo size="xl" />
              <div className="space-y-4">
                <h1 className="max-w-4xl font-[var(--font-display)] text-5xl font-bold leading-[0.95] text-white md:text-7xl">
                  The carbon-aware compute
                  <span className="gradient-text block">control plane investors expect.</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  CO2 Router turns routing, disclosure exports, signal provenance, and workload timing
                  into one production surface. It does not just show green windows. It proves why a
                  decision was made, what risk was accepted, and what emissions were avoided.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <MetricPill label="Live regions" value={String(regions.length || 0)} tone="emerald" />
              <MetricPill
                label="Average signal"
                value={averageCarbon != null ? `${averageCarbon} g/kWh` : '--'}
                tone="cyan"
              />
              <MetricPill
                label="Best region"
                value={cleanestRegion?.name ?? '--'}
                tone="blue"
              />
              <MetricPill
                label="Modes"
                value="optimize + assurance"
                tone="amber"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/console"
                className="rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Open Command Center
              </Link>
              <button
                type="button"
                onClick={() => document.getElementById('routing-theater')?.scrollIntoView()}
                className="rounded-full border border-slate-700 bg-slate-900/60 px-6 py-3 font-semibold text-white transition hover:border-slate-600 hover:bg-slate-900"
              >
                See Live Routing
              </button>
              <Link
                href="/methodology"
                className="rounded-full border border-slate-800 bg-slate-950/60 px-6 py-3 font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
              >
                Read Methodology
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card-glow signal-scan relative overflow-hidden rounded-[28px] p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Signal Fabric</p>
                  <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
                    Grid pulse right now
                  </h2>
                </div>
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  LIVE
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <svg viewBox="0 0 320 150" className="h-44 w-full animate-waveform">
                  <defs>
                    <linearGradient id="signal-line" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="50%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="320" height="150" fill="rgba(2,6,23,0.7)" />
                  {[30, 60, 90, 120].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      x2="320"
                      y1={y}
                      y2={y}
                      stroke="rgba(51,65,85,0.45)"
                      strokeDasharray="4 6"
                    />
                  ))}
                  {sparkline ? (
                    <polyline
                      fill="none"
                      stroke="url(#signal-line)"
                      strokeWidth="3.5"
                      points={sparkline}
                      className="line-draw"
                    />
                  ) : (
                    <polyline
                      fill="none"
                      stroke="url(#signal-line)"
                      strokeWidth="3.5"
                      points="0,92 56,88 112,54 168,74 224,48 280,68 320,40"
                      className="line-draw"
                    />
                  )}
                </svg>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {regions.slice(0, 3).map((region) => (
                  <div key={region.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{region.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                          {region.signalQuality}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-emerald-300">{region.carbon} g</p>
                    </div>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400"
                        style={{ width: `${clamp(100 - region.carbon / 8, 18, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FeatureMiniCard
                title="Assurance mode"
                body="Conservative routing with provenance, confidence bands, and replay-ready evidence."
              />
              <FeatureMiniCard
                title="Disclosure export"
                body="Operational history structured for hourly reporting and audit workflows."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-4">
        <CommandStrip
          title="Routing"
          value="Live path selection"
          detail="Immediate routing, replay, and revalidation across cloud regions."
        />
        <CommandStrip
          title="Signals"
          value="Tiered signal stack"
          detail="Primary, validation, and fallback sources with tracked disagreement."
        />
        <CommandStrip
          title="Assurance"
          value="Audit-safe mode"
          detail="Lowest defensible signal doctrine, conservative handling, and exports."
        />
        <CommandStrip
          title="Activation"
          value="DEKES handoff"
          detail="Buyer-intelligence workloads routed through the same carbon command plane."
        />
      </section>

      <section
        id="routing-theater"
        className="grid gap-6 rounded-[30px] border border-slate-800 bg-slate-950/60 p-6 md:p-8 xl:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Routing Theater"
            title="Live workload routing with visible confidence and policy context."
            body="This is the surface buyers should feel immediately: region quality, assurance behavior, and decision payloads that read like a command center, not a toy demo."
          />

          <div className="grid gap-3">
            {scenarios.map((scenario, index) => (
              <button
                key={scenario.label}
                type="button"
                onClick={() => {
                  setActiveScenario(index)
                  setDecision(null)
                  setDecisionError(null)
                }}
                className={`rounded-2xl border px-5 py-4 text-left transition ${
                  activeScenario === index
                    ? 'border-emerald-400/40 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{scenario.label}</p>
                    <p className="mt-1 text-sm text-slate-400">{scenario.description}</p>
                  </div>
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
                    {scenario.mode}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {regions.map((region) => (
              <div key={region.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{region.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                      renewable {region.renewable}% · demand {region.ramp >= 0 ? '+' : ''}
                      {region.ramp}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-emerald-300">{region.carbon}</p>
                    <p className="text-xs text-slate-500">g/kWh</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRouteGreen}
            disabled={routing || loadingSignals || regions.length === 0}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-4 font-semibold text-slate-950 transition hover:from-emerald-300 hover:to-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {routing ? 'Routing live workload...' : 'Route this workload now'}
          </button>

          {decisionError && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {decisionError}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="glass-card-glow rounded-[28px] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Decision Frame</p>
                <h3 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
                  {decision ? 'Active routing recommendation' : 'Waiting for a live routing call'}
                </h3>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                  qualityTone(decision?.qualityTier)
                }`}
              >
                {typeof decision?.qualityTier === 'string' ? decision.qualityTier : 'signal ready'}
              </span>
            </div>

            {decision ? (
              <div className="mt-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <DecisionMetric
                    label="Selected region"
                    value={String(decision.selectedRegion ?? '--')}
                    detail={String(decision.scenario ?? scenarios[activeScenario].workloadType)}
                  />
                  <DecisionMetric
                    label="Carbon delta"
                    value={
                      decision.carbon_delta_g_per_kwh != null
                        ? `${Math.round(Number(decision.carbon_delta_g_per_kwh))} g/kWh`
                        : String(decision.carbonDelta ?? '--')
                    }
                    detail="Improvement against baseline"
                  />
                  <DecisionMetric
                    label="Score"
                    value={
                      decision.score != null
                        ? `${Math.round(Number(decision.score) <= 1 ? Number(decision.score) * 100 : Number(decision.score))}/100`
                        : '--'
                    }
                    detail="Normalized routing quality"
                  />
                  <DecisionMetric
                    label="Source used"
                    value={String(decision.source_used ?? '--')}
                    detail={String(decision.validation_source ?? 'No validation source')}
                  />
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Operator doctrine</p>
                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    {String(
                      decision.doctrine ??
                        'CO2 Router selects the lowest defensible signal: the freshest, best-documented carbon signal available at routing time.'
                    )}
                  </p>
                </div>

                {typeof decision.legalDisclaimer === 'string' && decision.legalDisclaimer && (
                  <p className="text-sm leading-7 text-amber-100/80">
                    {String(decision.legalDisclaimer)}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 p-8 text-slate-400">
                Trigger a live routing request to populate the selected region, policy mode, confidence, and doctrine payload.
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FeaturePanel
              eyebrow="Must-have layer"
              title="Assurance + disclosure"
              copy="Not just greener routing. Hourly exports, replay, confidence bands, and defensible provenance."
            />
            <FeaturePanel
              eyebrow="Revenue layer"
              title="DEKES activation"
              copy="Lead generation and buyer-intelligence workloads can run through the same carbon routing command plane."
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[28px] border border-slate-800 bg-slate-950/60 p-6 xl:col-span-2">
          <SectionHeader
            eyebrow="What makes this hard to copy"
            title="Three infrastructure layers, one operator surface."
            body="Competitors typically stop at one signal or one recommendation. CO2 Router combines live routing, policy-safe assurance logic, and exportable decision history."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <FeatureRail
              title="Routing fabric"
              body="Immediate route selection, reroutes, lease revalidation, and best-window evaluation."
            />
            <FeatureRail
              title="Assurance layer"
              body="Policy modes, disclosure exports, standards mapping, and conservative disagreement handling."
            />
            <FeatureRail
              title="Signal governance"
              body="Primary, validation, and fallback providers with explicit provenance on every decision."
            />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Commercial model</p>
          <h3 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-white">
            Build for procurement, not curiosity.
          </h3>
          <div className="mt-6 space-y-4">
            <PricingTile
              tier="Starter"
              price="$99"
              detail="Routing, dashboard, and replay for teams validating carbon-aware operations."
            />
            <PricingTile
              tier="Growth"
              price="$499"
              detail="Assurance mode, disclosure exports, and multi-service orchestration."
            />
            <PricingTile
              tier="Enterprise"
              price="Custom"
              detail="Private governance workflows, policy tuning, and dedicated deployment controls."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body: string
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">{eyebrow}</p>
      <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-white md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">{body}</p>
    </div>
  )
}

function MetricPill({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'emerald' | 'cyan' | 'blue' | 'amber'
}) {
  const toneClass = {
    emerald: 'from-emerald-500/16 to-emerald-500/4 border-emerald-500/20 text-emerald-300',
    cyan: 'from-cyan-500/16 to-cyan-500/4 border-cyan-500/20 text-cyan-300',
    blue: 'from-blue-500/16 to-blue-500/4 border-blue-500/20 text-blue-300',
    amber: 'from-amber-500/16 to-amber-500/4 border-amber-500/20 text-amber-200',
  }

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-4 ${toneClass[tone]}`}>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  )
}

function FeatureMiniCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
    </div>
  )
}

function CommandStrip({
  title,
  value,
  detail,
}: {
  title: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5 hover-lift">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{title}</p>
      <p className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{detail}</p>
    </div>
  )
}

function DecisionMetric({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </div>
  )
}

function FeaturePanel({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string
  title: string
  copy: string
}) {
  return (
    <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>
      <p className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-white">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-400">{copy}</p>
    </div>
  )
}

function FeatureRail({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-5">
      <div className="mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400" />
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-400">{body}</p>
    </div>
  )
}

function PricingTile({
  tier,
  price,
  detail,
}: {
  tier: string
  price: string
  detail: string
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold text-white">{tier}</p>
        <p className="font-[var(--font-display)] text-2xl font-semibold text-emerald-300">{price}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{detail}</p>
    </div>
  )
}
