'use client'

import type { LiveSystemSnapshot } from '@/types/control-surface'

function compactHash(value: string | null) {
  if (!value) return 'n/a'
  if (value.length <= 16) return value
  return `${value.slice(0, 10)}...${value.slice(-6)}`
}

export function ProviderVerificationPanel({
  providers,
}: {
  providers: LiveSystemSnapshot['providers']
}) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
        Verified datasets
      </div>
      {!providers.available ? (
        <p className="mt-4 text-sm leading-7 text-slate-300">
          {providers.error ?? 'Provider verification is unavailable.'}
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {providers.datasets.map((dataset) => (
            <div
              key={dataset.name}
              className="rounded-2xl border border-white/8 bg-slate-950/60 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                  {dataset.name}
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  {dataset.verificationStatus.replace(/_/g, ' ')}
                </div>
              </div>
              <div className="mt-2 font-mono text-[11px] tracking-[0.08em] text-slate-400">
                version {dataset.datasetVersion ?? 'n/a'}
              </div>
              <div className="mt-2 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                <div className="font-mono text-[11px] tracking-[0.08em] text-slate-500">
                  manifest {compactHash(dataset.manifestHash)}
                </div>
                <div className="mt-1 font-mono text-[11px] tracking-[0.08em] text-slate-500">
                  computed {compactHash(dataset.computedHash)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
