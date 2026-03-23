'use client'

import { useQuery } from '@tanstack/react-query'
import { ecobeApi } from '@/lib/api'

export default function MethodologyPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['methodology-card'],
    queryFn: () => ecobeApi.getMethodology(),
  })

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Model Card</p>
        <h2 className="mt-3 text-4xl font-semibold text-white">Ecobe Methodology</h2>
        <p className="mt-4 max-w-3xl text-slate-400">
          Carbon-aware routing built around live provider provenance, explicit fallback rules,
          and the lowest defensible signal doctrine.
        </p>
      </section>

      {isLoading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-slate-400">
          Loading methodology...
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-red-300">
          {error instanceof Error ? error.message : 'Failed to load methodology'}
        </div>
      )}

      {data && (
        <>
          <section className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Doctrine</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{data.doctrine.name}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{data.doctrine.summary}</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-400">Operator Notice</p>
              <p className="mt-3 text-sm leading-7 text-amber-100/85">
                {data.doctrine.legalDisclaimer}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Scoring</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Weight Model</h3>
              </div>
              <p className="text-xs text-slate-500">Updated {data.lastUpdated}</p>
            </div>
            <p className="mt-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-xs text-emerald-300">
              {data.scoring.formula}
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {Object.entries(data.scoring.defaultWeights).map(([key, value]) => (
                <div key={key} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{key}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {(value * 100).toFixed(0)}%
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            {data.tiers.map((tier) => (
              <div key={tier.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">{tier.name}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{tier.purpose}</p>
                <div className="mt-5 space-y-3">
                  {tier.providers.map((provider) => (
                    <div key={provider.name} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                      <p className="text-sm font-semibold text-white">{provider.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{provider.role}</p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        {provider.coverage}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Reference Markdown</p>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm leading-7 text-slate-300">
              {data.markdown}
            </pre>
          </section>
        </>
      )}
    </div>
  )
}
