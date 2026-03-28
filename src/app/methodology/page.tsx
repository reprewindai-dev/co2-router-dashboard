import { getControlPlaneSnapshot } from '@/lib/ecobe'

const sections = [
  {
    title: 'Control plane vs data plane',
    body: 'The engine authorizes workloads before execution. CI/CD and Kubernetes consume enforcement artifacts after the decision is made. The UI explains that doctrine; it does not perform authorization.',
  },
  {
    title: 'Deterministic doctrine',
    body: 'The engine resolves requests in fixed order: policy hard overrides, water guardrails, latency and SLA protection, carbon optimization inside the allowed envelope, then cost as a late tie-breaker.',
  },
  {
    title: 'Lowest defensible signal',
    body: 'When carbon providers disagree, the runtime path favors defensibility, freshness, and lineage instead of blindly choosing the lowest theoretical intensity number.',
  },
  {
    title: 'MSS',
    body: 'The mirrored signal stack is a versioned resilience layer. It tracks provider health, freshness, disagreement, last-known-good use, and snapshot lineage so replay and degraded behavior stay explainable.',
  },
  {
    title: 'Water guardrails',
    body: 'Water is not a cosmetic score. Basin authority, optional facility overlays, and fallback posture can trigger reroute, delay, throttle, or deny before execution.',
  },
  {
    title: 'Proof and replay',
    body: 'Every decision should answer what would have happened by default, what was selected instead, which signal and doctrine state were used, and whether degraded or fallback posture was involved.',
  },
  {
    title: 'Universal adapter plane',
    body: 'HTTP, CloudEvents, queue/job, Lambda, CI/CD, and Kubernetes support are all thin adapters around one canonical decision envelope and one canonical proof envelope. Adapters translate transport and control-point context; they do not score or decide.',
  },
  {
    title: 'OpenTelemetry bridge',
    body: 'Decision spans carry decision frame ID, action, reason code, operating mode, proof hash, fallback posture, runtime, region, and adapter metadata so downstream observability systems can correlate execution with authorization.',
  },
]

export default async function MethodologyPage() {
  const snapshot = await getControlPlaneSnapshot()

  return (
    <div className="space-y-8 pb-10">
      <section className="surface-card-strong p-8">
        <div className="eyebrow">Methodology</div>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">How the control plane makes binding decisions.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          This page explains the live doctrine without exposing sensitive tuning. It separates runtime truth, degraded operation, and assurance posture so the public layer stays technically honest.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title} className="surface-card p-6">
            <div className="eyebrow">{section.title}</div>
            <p className="mt-4 text-sm leading-7 text-slate-300">{section.body}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="surface-card p-6">
          <div className="eyebrow">Live provider posture</div>
          <div className="mt-5 grid gap-4">
            {snapshot.methodologyProviders?.providers?.map((provider) => (
              <div key={provider.name} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-semibold text-white">{provider.name}</div>
                  <span className="pill border-white/10 bg-white/5 text-slate-200">{provider.status}</span>
                </div>
                <div className="mt-3 text-sm text-slate-400">
                  {provider.latencyMs !== null
                    ? `Last latency: ${provider.latencyMs} ms`
                    : provider.lastSuccessAt
                      ? `Last observed: ${new Date(provider.lastSuccessAt).toLocaleString()}`
                      : 'Last observed: unavailable'}
                </div>
              </div>
            )) ?? <div className="text-sm text-slate-400">Provider methodology data is currently unavailable.</div>}
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="eyebrow">Assurance posture</div>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
            <p>
              Operational health and assurance readiness are reported separately. A control plane can still function while source hashes remain unverified; it just cannot honestly claim full source-pin assurance yet.
            </p>
            <p>
              Current readiness: <span className="font-semibold text-white">{snapshot.health?.checks.assuranceReady ? 'assurance-ready' : 'operational only'}</span>
            </p>
            <p>
              Unhashed datasets: {(snapshot.health?.assurance?.unhashedDatasets ?? []).join(', ') || 'none reported'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="surface-card p-6">
          <div className="eyebrow">Adapter control points</div>
          <div className="mt-5 grid gap-4">
            {snapshot.adapters?.adapters?.map((adapter) => (
              <div key={adapter.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="font-semibold text-white">{adapter.runtime}</div>
                <div className="mt-2 font-mono text-xs text-slate-400">{adapter.id}</div>
                <div className="mt-3 text-sm text-slate-300">{adapter.controlPoints.join(', ')}</div>
              </div>
            )) ?? <div className="text-sm text-slate-400">Adapter metadata is currently unavailable.</div>}
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="eyebrow">Water provenance reality</div>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
            <p>Verified datasets: <span className="font-semibold text-white">{snapshot.provenance?.summary.verified ?? 0}</span></p>
            <p>Unverified datasets: <span className="font-semibold text-white">{snapshot.provenance?.summary.unverified ?? 0}</span></p>
            <p>Missing local source files: <span className="font-semibold text-white">{snapshot.provenance?.summary.missingSource ?? 0}</span></p>
            <p>
              The control plane does not claim full assurance if local source files are missing or hashes remain unverified.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
