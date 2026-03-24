'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

import { BestWindowPanel } from '@/components/BestWindowPanel'
import { CarbonBudgetPanel } from '@/components/CarbonBudgetPanel'
import { CarbonHeatCalendar } from '@/components/CarbonHeatCalendar'
import { CarbonOpportunityMap } from '@/components/CarbonOpportunityMap'
import { CarbonOpportunityTimeline } from '@/components/CarbonOpportunityTimeline'
import { CarbonReductionMultiplier } from '@/components/CarbonReductionMultiplier'
import { CarbonSavingsDashboard } from '@/components/CarbonSavingsDashboard'
import { CIRoutingMonitor } from '@/components/CIRoutingMonitor'
import { DecisionConfidencePanel } from '@/components/DecisionConfidencePanel'
import { DecisionEngineStatus } from '@/components/DecisionEngineStatus'
import { DecisionReplay } from '@/components/DecisionReplay'
import { DecisionStream } from '@/components/DecisionStream'
import { DekesHandoffPanel } from '@/components/DekesHandoffPanel'
import { DekesImpactCard } from '@/components/DekesImpactCard'
import { DekesStats } from '@/components/DekesStats'
import { DisclosureExportPanel } from '@/components/DisclosureExportPanel'
import { EmberStructuralPanel } from '@/components/EmberStructuralPanel'
import { EnergyCalculator } from '@/components/EnergyCalculator'
import { ExecutionIntegrityPanel } from '@/components/ExecutionIntegrityPanel'
import { ForecastAccuracyTracker } from '@/components/ForecastAccuracyTracker'
import { GreenRoutingForm } from '@/components/GreenRoutingForm'
import { GridIntelligencePanel } from '@/components/GridIntelligencePanel'
import { IntegrationSourcesPanel } from '@/components/IntegrationSourcesPanel'
import { OrgRiskTable } from '@/components/OrgRiskTable'
import { PolicyEnforcementPanel } from '@/components/PolicyEnforcementPanel'
import { ProviderHealthMonitor } from '@/components/ProviderHealthMonitor'
import { SystemHealth } from '@/components/SystemHealth'
import { WorkloadImpactGraph } from '@/components/WorkloadImpactGraph'

type Tab = 'mission' | 'signals' | 'routing' | 'assurance' | 'activation'

const TABS: Array<{
  id: Tab
  label: string
  sub: string
  eyebrow: string
  summary: string
}> = [
  {
    id: 'mission',
    label: 'Mission Control',
    sub: 'Decisions · integrity · budget',
    eyebrow: 'Live control plane',
    summary: 'Immediate routing state, active decision flow, and execution integrity across the system.',
  },
  {
    id: 'signals',
    label: 'Signals',
    sub: 'Grid fabric · provider health',
    eyebrow: 'Signal operations',
    summary: 'Region quality, forecast hygiene, provider resilience, and structural signal context.',
  },
  {
    id: 'routing',
    label: 'Routing',
    sub: 'Route · replay · best window',
    eyebrow: 'Operator controls',
    summary: 'Run live routing, replay decisions, and inspect multi-region scheduling surfaces.',
  },
  {
    id: 'assurance',
    label: 'Assurance',
    sub: 'Disclosure · confidence · sources',
    eyebrow: 'Audit-safe surface',
    summary: 'Confidence, disclosure export, standards mapping, and supporting source visibility.',
  },
  {
    id: 'activation',
    label: 'Activation',
    sub: 'DEKES · handoffs · risk',
    eyebrow: 'Business linkage',
    summary: 'How carbon-aware routing connects to DEKES activation, decision-derived runtime signals, and downstream risk.',
  },
]

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('mission')

  const activeTab = useMemo(() => {
    return TABS.find((entry) => entry.id === tab) ?? TABS[0]
  }, [tab])

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[30px] border border-slate-800 bg-slate-950/65 px-6 py-8 shadow-[0_24px_80px_rgba(2,6,23,0.45)] md:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 pulse-glow" />
              Live command center for routing, assurance, and activation.
            </div>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{activeTab.eyebrow}</p>
              <h1 className="font-[var(--font-display)] text-5xl font-semibold leading-[0.96] text-white md:text-6xl">
                CO2 Router
                <span className="gradient-text block">command center</span>
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">{activeTab.summary}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <HeroCard
                title="Decision fabric"
                value="Live"
                detail="Streaming routing decisions, replay, and workload policy outcomes."
              />
              <HeroCard
                title="Assurance posture"
                value="Ready"
                detail="Disclosure export, methodology, and confidence surfaces exposed in one place."
              />
              <HeroCard
                title="Business impact"
                value="DEKES"
                detail="Lead-generation and buyer-intelligence workloads tied into the same command plane."
              />
            </div>
          </div>

          <div className="glass-card-glow rounded-[28px] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Flight deck</p>
                <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
                  Navigation map
                </h2>
              </div>
              <Link
                href="/"
                className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white"
              >
                Overview
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {TABS.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setTab(entry.id)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                    tab === entry.id
                      ? 'border-emerald-400/40 bg-emerald-500/10'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{entry.label}</p>
                      <p className="mt-1 text-sm text-slate-400">{entry.sub}</p>
                    </div>
                    <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300">
                      {entry.id}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-x-auto">
        <nav className="flex min-w-max gap-3 rounded-[24px] border border-slate-800 bg-slate-950/65 p-2">
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setTab(entry.id)}
              className={`rounded-[18px] px-4 py-3 text-left transition ${
                tab === entry.id
                  ? 'bg-emerald-500/12 text-emerald-200'
                  : 'text-slate-400 hover:bg-slate-900/80 hover:text-white'
              }`}
            >
              <span className="block text-sm font-semibold">{entry.label}</span>
              <span className="mt-1 block text-xs">{entry.sub}</span>
            </button>
          ))}
        </nav>
      </section>

      {tab === 'mission' && (
        <div className="space-y-6">
          <CarbonReductionMultiplier />
          <DecisionEngineStatus />
          <CarbonOpportunityTimeline />
          <DecisionStream />
          <div className="grid gap-6 xl:grid-cols-2">
            <CarbonSavingsDashboard />
            <CarbonBudgetPanel />
          </div>
          <ExecutionIntegrityPanel />
          <div className="grid gap-6 xl:grid-cols-2">
            <ProviderHealthMonitor />
            <CIRoutingMonitor />
          </div>
          <PolicyEnforcementPanel />
        </div>
      )}

      {tab === 'signals' && (
        <div className="space-y-6">
          <CarbonOpportunityMap />
          <GridIntelligencePanel />
          <EmberStructuralPanel />
          <ForecastAccuracyTracker />
        </div>
      )}

      {tab === 'routing' && (
        <div className="space-y-8">
          <GreenRoutingForm />
          <div className="grid gap-6 xl:grid-cols-2">
            <BestWindowPanel />
            <EnergyCalculator />
          </div>
          <DecisionReplay />
        </div>
      )}

      {tab === 'assurance' && (
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <DecisionConfidencePanel />
            <SystemHealth />
          </div>
          <DisclosureExportPanel />
          <IntegrationSourcesPanel />
          <WorkloadImpactGraph />
          <CarbonHeatCalendar />
        </div>
      )}

      {tab === 'activation' && (
        <div className="space-y-6">
          <DekesImpactCard />
          <DekesStats />
          <DekesHandoffPanel />
          <OrgRiskTable />
        </div>
      )}
    </div>
  )
}

function HeroCard({
  title,
  value,
  detail,
}: {
  title: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{title}</p>
      <p className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{detail}</p>
    </div>
  )
}
