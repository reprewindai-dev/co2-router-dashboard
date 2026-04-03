import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'

import { getHallOGridSnapshot } from '@/lib/control-surface/hallogrid'
import { createPageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = createPageMetadata({
  title: 'HallOGrid Control Surface',
  description:
    'HallOGrid is the mirror system behind CO2 Router Console: snapshot plus stream transport, adapter normalization, trace, replay, proof, trust, and runtime safeguards for governed execution.',
  path: '/control-surface',
  keywords: [
    'HallOGrid',
    'HallOGrid control surface',
    'CO2 Router HallOGrid',
    'control-plane mirror system',
    'snapshot plus stream transport',
    'adapter normalization',
    'trace replay proof',
  ],
})

function toneForState(state: string) {
  if (state === 'healthy') return 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100'
  if (state === 'degraded') return 'border-amber-400/25 bg-amber-400/10 text-amber-100'
  if (state === 'stale' || state === 'broken') return 'border-rose-400/25 bg-rose-400/10 text-rose-100'
  return 'border-white/10 bg-white/[0.04] text-slate-200'
}

export default async function ControlSurfacePage() {
  const host = headers().get('host')?.toLowerCase() ?? 'co2router.com'
  const isTechHost = host.includes('co2router.tech')
  const snapshot = await getHallOGridSnapshot()
  const selected = snapshot.selectedFrame

  return (
    <div className="space-y-8 pb-10">
      <section className="overflow-hidden rounded-[34px] border border-cyan-300/14 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.1),transparent_35%),linear-gradient(180deg,rgba(5,15,33,0.98),rgba(3,7,18,0.94))] p-8 shadow-[0_40px_160px_rgba(2,6,23,0.56)]">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl space-y-4">
            <div className="eyebrow text-cyan-300">{isTechHost ? 'Technical dossier' : 'Public deep dive'}</div>
            <h1 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">
              HallOGrid is the mirror system behind CO2 Router Console.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-300">
              It is not decorative UI. HallOGrid is the runtime-facing interface layer that turns
              governed execution into a legible operator surface: snapshot plus stream, normalized
              adapters, immediate selected-frame spotlight, and trace, replay, and proof that stay
              attached to the decision they explain.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/console"
                className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
              >
                Open CO2 Router Console
              </Link>
              <a
                href={isTechHost ? 'https://co2router.com/console' : 'https://co2router.tech/control-surface'}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
              >
                {isTechHost ? 'View .com operator surface' : 'View .tech dossier host'}
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="surface-card p-4">
              <div className="eyebrow">Transport</div>
              <div className="mt-2 text-2xl font-semibold text-white">{snapshot.transport.mode}</div>
            </div>
            <div className="surface-card p-4">
              <div className="eyebrow">Projection</div>
              <div className="mt-2 text-2xl font-semibold text-white">{snapshot.projection.dataStatus}</div>
            </div>
            <div className="surface-card p-4">
              <div className="eyebrow">Selected frame</div>
              <div className="mt-2 text-2xl font-semibold text-white">{selected?.frame.action.replace('_', ' ') ?? 'none'}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card-strong p-6">
          <div className="eyebrow">Operator intent</div>
          <h2 className="mt-3 text-3xl font-semibold text-white">One feed. One spotlight. One evidence dock.</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Decision feed lane</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Recent frames are the entry point. Clicking a frame opens the governed record inline
                instead of forcing the operator to search the rest of the page for meaning.
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Selected spotlight</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The selected frame becomes the visual center of gravity: action, reason, trust,
                latency, carbon delta, water delta, and confidence in one immediate read.
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Evidence dock</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Trace, replay, and proof are the only next-step verbs. They jump directly into the
                evidence dock instead of duplicating the same summary panels again and again.
              </p>
            </div>
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="eyebrow">Live posture</div>
          <div className="mt-4 space-y-3">
            <div className={`rounded-[20px] border px-4 py-3 ${toneForState(snapshot.projection.dataStatus)}`}>
              Projection is {snapshot.projection.dataStatus}. Generated {new Date(snapshot.generatedAt).toLocaleString()}.
            </div>
            <div className="rounded-[20px] border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-300">
              Stream {snapshot.transport.streamHealthy ? 'healthy' : 'degraded-safe snapshot mode'}.
            </div>
            <div className="rounded-[20px] border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-300">
              Active adapters: {snapshot.transport.adapters.filter((adapter) => adapter.enabled).length} /
              {' '}
              {snapshot.transport.adapters.length}
            </div>
            <div className="rounded-[20px] border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-300">
              Governance source: {selected?.frame.governanceSource ?? selected?.evidence.trace.governanceSource ?? snapshot.governance.source ?? 'unavailable'}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="surface-card p-6">
          <div className="eyebrow">Data transport model</div>
          <h2 className="mt-3 text-2xl font-semibold text-white">Snapshot plus stream.</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
            <p>
              Snapshot is the recovery layer. It loads initial truth, restores state after network
              damage, and becomes the fallback authority when the live stream degrades.
            </p>
            <p>
              Stream is the mirror layer. It refreshes HallOGrid frames without forcing the console to
              poll arbitrary backend endpoints directly from the browser.
            </p>
            <p>
              The browser reads dashboard-owned contracts only. That keeps third-party credentials,
              raw provider payloads, and customer-specific upstream formats out of the interface.
            </p>
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="eyebrow">Adapter contract</div>
          <h2 className="mt-3 text-2xl font-semibold text-white">Normalize first. Render second.</h2>
          <div className="mt-5 space-y-3">
            {snapshot.transport.adapters.map((adapter) => (
              <div key={adapter.id} className="rounded-[20px] border border-white/10 bg-slate-950/55 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-white">{adapter.label}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{adapter.kind}</div>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${
                      adapter.enabled
                        ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                        : 'border-white/10 bg-white/[0.04] text-slate-300'
                    }`}
                  >
                    {adapter.enabled ? 'enabled' : 'reserved'}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{adapter.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card p-6">
          <div className="eyebrow">Evidence model</div>
          <h2 className="mt-3 text-2xl font-semibold text-white">Trace, replay, and proof stay attached to the frame.</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[20px] border border-white/10 bg-slate-950/55 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Trace</div>
              <div className="mt-3 text-sm font-semibold text-white">{selected?.evidence.trace.hash ?? 'Unavailable'}</div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Sequence, input hash, constraints applied, and resolved candidate set.
              </p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-slate-950/55 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Replay</div>
              <div className="mt-3 text-sm font-semibold text-white">
                {selected?.evidence.replay.deterministicMatch == null
                  ? 'Unavailable'
                  : selected.evidence.replay.deterministicMatch
                    ? 'Deterministic match'
                    : 'Mismatch detected'}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Stored decision vs replayed decision, with mismatches called out instead of buried.
              </p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-slate-950/55 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Proof</div>
              <div className="mt-3 break-all text-sm font-semibold text-white">{selected?.evidence.proof.hash ?? 'Unavailable'}</div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Evidence refs, provider snapshot refs, and execution timing held on the same governed record.
              </p>
            </div>
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="eyebrow">Motion and performance safeguards</div>
          <h2 className="mt-3 text-2xl font-semibold text-white">Presence without noise.</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            <li>HallOGrid caps the live frame stack instead of animating an unbounded feed.</li>
            <li>Reduced-motion and degraded visual paths strip blur and bloom without losing hierarchy.</li>
            <li>Selection, focus, and evidence transitions exist to orient the operator, not decorate the page.</li>
            <li>When the stream degrades, the surface holds to snapshot truth rather than pretending nothing happened.</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="surface-card p-6">
          <div className="eyebrow">Authorship and provenance</div>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            <p><span className="font-semibold text-white">Concept direction:</span> CO2 Router founder</p>
            <p><span className="font-semibold text-white">System design and implementation specification:</span> Codex</p>
            <p>
              HallOGrid exists to make governed execution legible, immediate, and trustworthy for
              operators, buyers, developers, and investors.
            </p>
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="eyebrow">Build stamp</div>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            <p><span className="font-semibold text-white">Rendered host:</span> {host}</p>
            <p><span className="font-semibold text-white">Snapshot generated:</span> {new Date(snapshot.generatedAt).toLocaleString()}</p>
            <p><span className="font-semibold text-white">Selected frame:</span> {selected?.frame.id ?? 'Unavailable'}</p>
            <p><span className="font-semibold text-white">Deployment signature:</span> {process.env.VERCEL_GIT_COMMIT_SHA ?? 'local-build'}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
