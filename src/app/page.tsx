import Link from 'next/link'

import { classifySourceMode, formatMs, getControlPlaneSnapshot } from '@/lib/ecobe'

const trustTiles = [
  'HTTP API',
  'GitHub Actions / CI',
  'AWS Lambda adapter',
  'Kubernetes',
  'Batch / Queues',
  'Webhooks',
  'Postgres / Audit trail',
]

const decisionTypes = [
  {
    id: 'run_now',
    title: 'Run now',
    body: 'Authorize immediate execution when the workload stays inside policy, water, latency, and reliability bounds.',
    tone: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100',
  },
  {
    id: 'reroute',
    title: 'Reroute',
    body: 'Move execution to a better region or runtime target when the default path is allowed but no longer optimal or safe.',
    tone: 'border-cyan-300/20 bg-cyan-400/10 text-cyan-100',
  },
  {
    id: 'delay',
    title: 'Delay',
    body: 'Hold execution until the workload reaches an allowed decision window under the active doctrine.',
    tone: 'border-amber-300/20 bg-amber-400/10 text-amber-100',
  },
  {
    id: 'throttle',
    title: 'Throttle',
    body: 'Reduce intensity or concurrency when execution is allowed but capacity or policy conditions require bounded pressure.',
    tone: 'border-orange-300/20 bg-orange-400/10 text-orange-100',
  },
  {
    id: 'deny',
    title: 'Deny',
    body: 'Fail closed when the request cannot be justified under the current signal, policy, or integrity posture.',
    tone: 'border-rose-300/20 bg-rose-400/10 text-rose-100',
  },
] as const

const painPoints = [
  'Blind schedulers run first and explain later.',
  'Policy enforcement drifts across CI, serverless, and cluster entry points.',
  'Teams prove execution decisions manually after the fact.',
  'Carbon and water are either ignored or reduced to soft reporting.',
]

const whyBuy = [
  {
    title: 'Stop bad runs before they happen',
    body: 'Default infrastructure keeps executing under stale, degraded, or policy-breaking conditions. CO2 Router puts a decision gate in front of that path.',
  },
  {
    title: 'Enforce one doctrine everywhere',
    body: 'Use one canonical decision and proof model across API, CI, Kubernetes, queues, and adapter-driven runtime entry points.',
  },
  {
    title: 'Prove why the decision happened',
    body: 'Persist decision frames, proof hashes, replay inputs, and operational posture so buyers and operators can inspect the result later.',
  },
]

const integrationSurfaces = [
  {
    title: 'API mode',
    body: 'Synchronous authorization for apps, gateways, schedulers, and orchestration layers that can call an HTTP endpoint.',
  },
  {
    title: 'CI mode',
    body: 'Pre-job control for GitHub Actions and other pipeline runners, with enforcement bundles and proof references returned to the job.',
  },
  {
    title: 'Lambda adapter',
    body: 'Serverless support stays adapter-shaped so the core engine remains runtime-agnostic.',
  },
  {
    title: 'Kubernetes lane',
    body: 'Admission, region hinting, throttle posture, and Gatekeeper-compatible enforcement outputs.',
  },
  {
    title: 'Queue / dispatcher lane',
    body: 'Delay, reroute, or deny queued work before dispatch rather than trying to repair execution afterward.',
  },
  {
    title: 'Webhook / event lane',
    body: 'CloudEvents-compatible ingest and signed outbound decision events for async systems.',
  },
] as const

const requestExample = `POST /api/v1/ci/authorize
Content-Type: application/json

{
  "requestId": "req_nightly_batch_042",
  "idempotencyKey": "nightly-batch-042",
  "caller": {
    "id": "github-actions",
    "kind": "ci",
    "signature": "sig_v1"
  },
  "runtimeTarget": {
    "runtime": "kubernetes",
    "provider": "aws",
    "transport": "sync_http",
    "controlPoint": "runner_pre_job",
    "preferredRegions": ["us-east-1", "eu-west-1"]
  },
  "workload": {
    "name": "nightly-model-batch",
    "type": "ci",
    "criticality": "standard"
  },
  "constraints": {
    "allowDelay": true,
    "maxDelayMinutes": 30,
    "latencyCeilingMs": 250
  },
  "environmentalPolicy": {
    "signalPolicy": "marginal_first",
    "waterPolicyProfile": "default",
    "scenario": "current"
  }
}`

const responseExample = `{
  "decisionFrameId": "d82c61fd-4bd1-4d92-920d-9abba6b2144b",
  "decisionEnvelope": {
    "action": "delay",
    "reasonCode": "DELAY_HIGH_WATER",
    "selectedTarget": {
      "region": "us-east-1",
      "runtime": "http"
    }
  },
  "proofEnvelope": {
    "posture": "operational",
    "proofHash": "262c0719fc8b084d8096fb412c61c595ee6a8a002ed52873ee2f19a070ef3629"
  },
  "adapterContext": {
    "adapterId": "ecobe.http.decision.v1",
    "transport": "sync_http",
    "enforcementResult": "applied"
  }
}`

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const snapshot = await getControlPlaneSnapshot()
  const latestDecision = snapshot.latestDecision
  const latestMode = latestDecision
    ? classifySourceMode({
        decisionMode: latestDecision.decisionMode,
        fallbackUsed: latestDecision.fallbackUsed,
      })
    : 'live'
  const assuranceStatus = snapshot.health?.assurance?.status ?? 'unknown'
  const proofPreview = latestDecision?.proofHash ? `${latestDecision.proofHash.slice(0, 20)}...` : 'unavailable'
  const providerCount = snapshot.methodologyProviders?.providers?.length ?? 0
  const liveFrameCount = snapshot.totalDecisions

  return (
    <div className="space-y-8 pb-12">
      <section className="surface-card-strong overflow-hidden p-8 sm:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div className="space-y-6">
            <div className="eyebrow">Deterministic execution authority</div>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
                Control compute before it runs.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                CO2 Router evaluates workloads before execution and decides whether they should run, delay, reroute, throttle, or deny based on environmental, operational, and policy conditions.
              </p>
              <p className="max-w-3xl text-lg leading-8 text-slate-200">
                Not monitoring. Not reporting. Decision authority, enforcement posture, and proof.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/architecture"
                className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                View architecture
              </Link>
              <Link
                href="#live-decision"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
              >
                See live decision flow
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="eyebrow">Production posture</div>
                <div className="mt-3 text-2xl font-semibold text-white">{snapshot.health?.status ?? 'unknown'}</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="eyebrow">Assurance</div>
                <div className="mt-3 text-2xl font-semibold text-white">{assuranceStatus}</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="eyebrow">Recent frames</div>
                <div className="mt-3 text-2xl font-semibold text-white">{liveFrameCount}</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_25px_100px_rgba(2,6,23,0.55)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="eyebrow">Live decision console preview</div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    {latestDecision?.action?.replace('_', ' ') ?? 'decision pending'}
                  </div>
                </div>
                <span className="pill border-white/10 bg-white/5 text-slate-200">{latestMode}</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Frame</div>
                  <div className="mt-2 font-mono text-xs text-slate-200">
                    {latestDecision?.decisionFrameId ?? 'awaiting-live-frame'}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Proof hash</div>
                  <div className="mt-2 font-mono text-xs text-slate-200">{proofPreview}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Target</div>
                  <div className="mt-2 text-sm text-slate-200">{latestDecision?.selectedRegion ?? 'n/a'}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Latency</div>
                  <div className="mt-2 text-sm text-slate-200">{formatMs(latestDecision?.latencyMs?.total)}</div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-cyan-300/10 bg-cyan-400/5 p-4 text-sm leading-7 text-slate-300">
                Newer production rows include canonical decision, proof, telemetry, and adapter context. Public assurance is intentionally labeled operational until source provenance is fully closed.
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/50">
              <div className="relative aspect-[16/10] overflow-hidden">
                <video className="h-full w-full object-cover" autoPlay muted loop playsInline poster="/co2router-poster.svg">
                  <source src="/the-ai-making-the-cloud-greener.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card p-6">
        <div className="eyebrow">Runtime and proof surfaces</div>
        <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-7">
          {trustTiles.map((tile) => (
            <div key={tile} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 text-center text-sm font-medium text-slate-200">
              {tile}
            </div>
          ))}
        </div>
      </section>

      <section id="live-decision" className="surface-card p-8">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="eyebrow">Live decision proof block</div>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">A real decision, not just a claim.</h2>
            <p className="text-base leading-7 text-slate-300">
              This block is bound to the live engine snapshot. It shows the actual runtime decision posture the product is willing to stand behind publicly.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Workload</div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {(latestDecision?.decisionEnvelope as { selectedTarget?: { runtime?: string } } | null)?.selectedTarget?.runtime ?? latestDecision?.decisionMode ?? 'standard workload'}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Requested / selected region</div>
                <div className="mt-2 text-lg font-semibold text-white">{latestDecision?.selectedRegion ?? 'n/a'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Decision</div>
                <div className="mt-2 text-lg font-semibold text-white">{latestDecision?.action?.replace('_', ' ') ?? 'n/a'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Reason code</div>
                <div className="mt-2 text-lg font-semibold text-white">{latestDecision?.reasonCode ?? 'n/a'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Timestamp</div>
                <div className="mt-2 text-sm text-slate-200">
                  {latestDecision?.createdAt ? new Date(latestDecision.createdAt).toLocaleString() : 'n/a'}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Policy / doctrine</div>
                <div className="mt-2 text-sm text-slate-200">
                  {(latestDecision?.decisionEnvelope as { doctrine?: { version?: string } } | null)?.doctrine?.version ?? 'co2_router_doctrine_v1'}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Proof hash</div>
              <div className="mt-2 break-all font-mono text-xs text-slate-200">{latestDecision?.proofHash ?? 'unavailable'}</div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-300">
              Stored in the canonical decision frame record. Newer rows persist decision envelope, proof envelope, adapter context, and telemetry bridge data together.
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card p-8">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="eyebrow">The problem</div>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Most compute still runs blind.</h2>
            <p className="text-base leading-7 text-slate-300">
              Default schedulers do not evaluate carbon, water, policy, or proof before execution. Teams detect waste, risk, and drift after the fact.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {painPoints.map((point) => (
              <div key={point} className="rounded-3xl border border-white/10 bg-slate-950/55 p-5 text-sm leading-7 text-slate-300">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="decision-types" className="surface-card p-8">
        <div className="space-y-5">
          <div className="eyebrow">The decision model</div>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Five binding actions. One deterministic engine.</h2>
          <p className="max-w-3xl text-base leading-7 text-slate-300">
            The engine does not emit vague recommendations. It returns a binding action that downstream control points can enforce.
          </p>
          <div className="grid gap-4 lg:grid-cols-5">
            {decisionTypes.map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
                <span className={`pill ${item.tone}`}>{item.title}</span>
                <p className="mt-4 text-sm leading-7 text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="surface-card p-8">
        <div className="space-y-5">
          <div className="eyebrow">How it works</div>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">A control plane, not a dashboard pipeline.</h2>
          <div className="grid gap-4 xl:grid-cols-4">
            {[
              'Caller / workload',
              'CO2 Router decision engine',
              'Execution target',
              'Proof + telemetry',
            ].map((title, index) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
                <div className="eyebrow">Step {index + 1}</div>
                <div className="mt-3 text-xl font-semibold text-white">{title}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="eyebrow">Signals evaluated</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Carbon intensity, water authority, provider freshness, disagreement, fallback posture, and latency budgets.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="eyebrow">Policy checks</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Policy overrides, water guardrails, SLA protection, environmental optimization inside the allowed envelope, and cost as a late influence.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="eyebrow">Decision artifact</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                One decision frame, one proof hash, one replayable record, and one adapter context for the caller that invoked authorization.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card p-8">
        <div className="space-y-5">
          <div className="eyebrow">Why teams buy</div>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">This is a buying reason, not a sustainability nice-to-have.</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {whyBuy.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
                <div className="text-xl font-semibold text-white">{item.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="integration-surfaces" className="surface-card p-8">
        <div className="space-y-5">
          <div className="eyebrow">Integration surfaces</div>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Add control without replacing the stack.</h2>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {integrationSurfaces.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
                <div className="text-xl font-semibold text-white">{item.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="proof-replay" className="surface-card p-8">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4">
            <div className="eyebrow">Assurance and operational truth</div>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Sell what is true now.</h2>
            <p className="text-base leading-7 text-slate-300">
              The engine is live in production. Canonical decision storage works. Proof metadata exists on newer rows. Assurance posture is operational, and assurance closure is still in progress.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
              <div className="eyebrow">Production</div>
              <div className="mt-3 text-2xl font-semibold text-white">{snapshot.health?.status ?? 'unknown'}</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">Live Railway deployment, live provider traffic, and live canonical decision frames.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
              <div className="eyebrow">Assurance</div>
              <div className="mt-3 text-2xl font-semibold text-white">{assuranceStatus}</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Unhashed datasets: {(snapshot.health?.assurance?.unhashedDatasets ?? []).join(', ') || 'none reported'}.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
              <div className="eyebrow">Providers</div>
              <div className="mt-3 text-2xl font-semibold text-white">{providerCount}</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">Provider posture is surfaced directly in methodology and control surfaces, including degraded states.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
              <div className="eyebrow">Replay / proof</div>
              <div className="mt-3 text-2xl font-semibold text-white">{latestDecision?.proofHash ? 'present' : 'partial'}</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">Proof and telemetry are strongest on newer canonical rows. The site stays explicit about that boundary.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="developer-quickstart" className="surface-card p-8">
        <div className="space-y-5">
          <div className="eyebrow">Developer quickstart</div>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">A real developer path, not just marketing copy.</h2>
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Request example</div>
              <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-slate-200">
                <code>{requestExample}</code>
              </pre>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Response example</div>
              <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-slate-200">
                <code>{responseExample}</code>
              </pre>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-slate-300">
              <div className="text-base font-semibold text-white">API reference</div>
              Canonical Decision API v1 lives at <span className="font-mono text-slate-200">/api/v1/ci/authorize</span>.
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-slate-300">
              <div className="text-base font-semibold text-white">Webhook and event model</div>
              Async systems use CloudEvents-compatible envelopes and signed outbound decision events.
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-slate-300">
              <div className="text-base font-semibold text-white">Adapter model</div>
              Adapters translate runtime and transport context. The engine still decides.
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/developers#quickstart" className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
              Open developer guide
            </Link>
            <Link href="/control-surface" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5">
              View control surface
            </Link>
          </div>
        </div>
      </section>

      <section className="surface-card p-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <div className="space-y-4">
            <div className="eyebrow">Pricing / access</div>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Buy the control plane, not a seat count.</h2>
            <p className="text-base leading-7 text-slate-300">
              Commercial packaging is tied to decision volume, enforcement posture, proof depth, and governance scope. The buying path is direct even when the motion is pilot-led.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
              <div className="eyebrow">Pricing</div>
              <div className="mt-3 text-xl font-semibold text-white">Operator, Governance, Assurance</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">Commercial tiers for runtime authorization, enforcement, proof export, and regulated governance depth.</p>
              <Link href="/pricing" className="mt-4 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:text-white">
                View pricing
              </Link>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
              <div className="eyebrow">Access</div>
              <div className="mt-3 text-xl font-semibold text-white">Pilot with your real workloads</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">Start with one decision loop, one control point, and one proof trail that your team can inspect immediately.</p>
              <Link href="/access" className="mt-4 inline-flex rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
                Request access
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card-strong p-8 sm:p-10">
        <div className="max-w-4xl space-y-5">
          <div className="eyebrow">Final CTA</div>
          <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Put decision authority in front of execution.
          </h2>
          <p className="max-w-3xl text-base leading-7 text-slate-300">
            See how CO2 Router fits into your runtime, what it prevents before execution, and how the proof model holds up under scrutiny.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/architecture" className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
              View architecture
            </Link>
            <Link href="/access" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5">
              Request access
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
