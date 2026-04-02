const BLOG_TIME_ZONE = 'America/Toronto'

export type BlogFigure = {
  src: string
  alt: string
  caption?: string
}

export type BlogPost = {
  slug: string
  title: string
  description: string
  publishedAt: string
  releaseAt?: string
  readTime: string
  summary: string
  keywords: string[]
  coverImage?: BlogFigure
  sections: Array<{
    heading: string
    paragraphs: string[]
    figure?: BlogFigure
  }>
  relatedLinks: Array<{
    href: string
    label: string
  }>
}

function resolveReleaseAt(post: Pick<BlogPost, 'publishedAt' | 'releaseAt'>) {
  return new Date(post.releaseAt ?? `${post.publishedAt}T09:00:00-04:00`)
}

export function formatBlogPostDate(post: Pick<BlogPost, 'publishedAt' | 'releaseAt'>) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: BLOG_TIME_ZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(resolveReleaseAt(post))
}

export function isBlogPostPublished(
  post: Pick<BlogPost, 'publishedAt' | 'releaseAt'>,
  now = new Date()
) {
  return resolveReleaseAt(post).getTime() <= now.getTime()
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'what-is-pre-execution-environmental-governance-for-compute',
    title: 'What is pre-execution environmental governance for compute?',
    description:
      'Why environmentally-governed compute needs a binding authorization layer before execution instead of post-hoc reporting.',
    publishedAt: '2026-03-30',
    readTime: '7 min read',
    summary:
      'Pre-execution environmental governance means a workload is evaluated before it runs, not after the fact. The control plane decides whether compute can proceed, where it may run, and what proof stays attached to that decision.',
    keywords: [
      'pre-execution environmental governance',
      'compute governance',
      'carbon aware control plane',
      'water aware compute',
      'environmental execution control',
    ],
    sections: [
      {
        heading: 'Execution is the control point',
        paragraphs: [
          'Most sustainability software operates after execution. It measures impact, explains historical usage, or recommends better placement. That is useful for reporting, but it is not governance.',
          'Pre-execution governance moves the control point upstream. A workload asks to run. The authority layer evaluates the request against environmental signals, policy constraints, and execution posture before compute is admitted.',
        ],
      },
      {
        heading: 'Authorization changes the category',
        paragraphs: [
          'The critical distinction is whether the system can bind the outcome. A reporting tool can describe what happened. A scheduler can recommend a cleaner region. A control plane can return one of several binding actions such as run, reroute, delay, throttle, or deny.',
          'That changes the product from advisory software into operational infrastructure. The system does not describe behavior at the edge of execution. It decides whether behavior is allowed at all.',
        ],
      },
      {
        heading: 'Environmental governance is multi-objective',
        paragraphs: [
          'Carbon is not the only signal that matters. Water stress, latency protection, and operating policy all shape whether a decision is defensible. A real governance layer must combine them without hiding the trade-offs inside black-box heuristics.',
          'CO2 Router uses SAIQ governance to evaluate those constraints before execution. The result is attached to the decision frame so trace, replay, and provenance remain consistent with the decision that was actually enforced.',
        ],
      },
      {
        heading: 'Proof is part of the contract',
        paragraphs: [
          'Pre-execution governance only matters if the resulting decision can be inspected later. That requires proof, trace, replay, and provenance to stay attached to the same frame, rather than being reconstructed later from best-effort logs.',
          'The system therefore needs deterministic replay, trace-backed decision state, and verified environmental inputs. Without that, governance is only a narrative.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/methodology', label: 'Read the methodology' },
      { href: '/system/decision-engine', label: 'Inspect the decision engine' },
      { href: '/system/provenance', label: 'Review provenance' },
    ],
  },
  {
    slug: 'why-dashboards-are-not-enough-from-reporting-to-enforcement',
    title: 'Why dashboards are not enough: from reporting to enforcement',
    description:
      'Dashboards and telemetry are not enough to govern compute. The missing layer is pre-execution enforcement with proof.',
    publishedAt: '2026-03-30',
    readTime: '6 min read',
    summary:
      'Dashboards make systems visible. They do not decide whether a workload may run. Infrastructure governance requires an execution layer that can enforce policy before compute starts.',
    keywords: [
      'dashboards are not enough',
      'reporting versus enforcement',
      'control plane vs dashboard',
      'carbon dashboards',
      'infrastructure enforcement',
    ],
    sections: [
      {
        heading: 'Visibility is not authority',
        paragraphs: [
          'Dashboards are useful because they surface system state. They show carbon signals, cost posture, regional health, and decision history. They are not the layer that binds execution.',
          'If a workload can still run unchanged while the dashboard warns about better options, the operational control point remains elsewhere. Reporting has value, but it does not enforce.',
        ],
      },
      {
        heading: 'Enforcement begins before execution',
        paragraphs: [
          'A control surface becomes meaningful when it sits in front of execution and returns an outcome that downstream systems follow. That outcome has to exist before the workload starts, not after the fact.',
          'For environmental governance, that means carbon, water, and policy constraints must be resolved before the runtime commits to a region or queue.',
        ],
      },
      {
        heading: 'Proof separates infrastructure from presentation',
        paragraphs: [
          'Once a system starts returning binding decisions, it also has to explain them. That is why proof, trace, replay, and provenance are not ornamental features. They are part of the enforcement contract.',
          'A dashboard can display those artifacts, but the artifacts must originate in the decision system itself. Otherwise the presentation layer outruns the truth of the runtime.',
        ],
      },
      {
        heading: 'The new category is operational governance',
        paragraphs: [
          'CO2 Router is not trying to become a better dashboard. It is building a decision authority layer that happens to expose a public control surface. The dashboard exists to reveal the control plane, not to replace it.',
          'That is the transition from reporting to enforcement: from describing infrastructure behavior to governing it before execution.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/console', label: 'Open the control surface' },
      { href: '/assurance', label: 'See assurance posture' },
      { href: '/system/trace-ledger', label: 'Inspect trace ledger' },
    ],
  },
  {
    slug: 'how-co2-router-makes-deterministic-decisions-with-proof-replay-and-provenance',
    title: 'How CO2 Router makes deterministic decisions with proof, replay, and provenance',
    description:
      'Inside the deterministic decision chain: signals, SAIQ governance, policy, decision, proof, replay, and provenance.',
    publishedAt: '2026-03-30',
    readTime: '8 min read',
    summary:
      'The system path is intentionally strict: signals are normalized, SAIQ governance applies policy, the engine returns a binding decision, and proof artifacts remain attached to the resulting frame for replay and inspection.',
    keywords: [
      'deterministic decisions',
      'proof replay provenance',
      'SAIQ governance',
      'trace ledger',
      'environmental decision engine',
    ],
    sections: [
      {
        heading: 'Signals become a bounded decision input',
        paragraphs: [
          'CO2 Router does not let request-time provider behavior define execution. Signals are collected, normalized, cached, and evaluated through a bounded decision path. Carbon and water inputs exist to support a deterministic decision, not a best-effort live fetch.',
          'That distinction matters for both latency and trust. A control plane cannot wait on the outside world and still claim real-time authority.',
        ],
      },
      {
        heading: 'SAIQ provides governance context',
        paragraphs: [
          'SAIQ is the governance layer that applies weighting, constraint logic, and zone semantics to the decision frame. It does not replace the engine. It explains how policy shaped the final action.',
          'That governance state becomes part of the trace record so the control plane can show why the frame was admitted, delayed, rerouted, throttled, or denied.',
        ],
      },
      {
        heading: 'The decision is binding',
        paragraphs: [
          'Once the engine resolves the frame, it returns one binding outcome. The downstream adapter or runtime uses that result as the execution authority. That is the moment where infrastructure control actually exists.',
          'Everything after that point is evidence: proof references, trace state, replay posture, and provenance visibility.',
        ],
      },
      {
        heading: 'Replay and provenance close the loop',
        paragraphs: [
          'Replay only matters if the same frame can be reconstructed against the same stored inputs. Provenance only matters if the environmental datasets behind the decision can be identified and verified.',
          'The result is a single chain from signal inputs to proof artifacts. That is what lets the product defend a decision instead of merely describing one.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/developers/architecture', label: 'View architecture' },
      { href: '/system/replay', label: 'Inspect replay' },
      { href: '/system/provenance', label: 'Inspect provenance' },
    ],
  },
  {
    slug: 'from-infrastructure-optimization-to-execution-control',
    title: 'From infrastructure optimization to execution control',
    description:
      'Why CO2 Router moves the category from optimization narratives to pre-execution authorization with proof.',
    publishedAt: '2026-04-01',
    releaseAt: '2026-04-01T08:00:00-04:00',
    readTime: '6 min read',
    summary:
      'Optimization language is no longer enough. CO2 Router turns carbon, water, latency, and cost into a bounded pre-execution decision path that returns binding authority before compute starts.',
    keywords: [
      'execution control',
      'infrastructure optimization',
      'deterministic control plane',
      'pre-execution authorization',
      'environmental execution control',
    ],
    coverImage: {
      src: '/blog/co2-router/co2routeroptimazatintoexcution.png',
      alt: 'CO2 Router infographic showing the shift from infrastructure optimization to binding execution control.',
      caption:
        'The public-safe frame: normalize signals, apply governance and policy, then attach proof to a binding action before the workload runs.',
    },
    sections: [
      {
        heading: 'Optimization is not enough once execution is on the line',
        paragraphs: [
          'Optimization language usually means a system found a cleaner or cheaper place to run after comparing possible options. That is useful, but it still leaves the final authority somewhere else.',
          'CO2 Router changes the control point. The workload asks to run, the control plane evaluates the frame, and the runtime follows the returned action before execution begins.',
        ],
        figure: {
          src: '/blog/co2-router/co2routerslide12.png',
          alt: 'CO2 Router title slide introducing the deterministic environmental execution control plane.',
          caption:
            'The core claim stays simple: authorize compute before it runs, and keep proof attached to the same decision frame.',
        },
      },
      {
        heading: 'The decision path is intentionally narrow',
        paragraphs: [
          'Signals are normalized into bounded inputs. SAIQ governance shapes the frame. Policy determines admissibility. The engine returns one binding outcome. Proof, replay posture, and provenance stay attached to that same frame.',
          'That structure matters because the product is not trying to become a general sustainability suite. It is an execution control plane that must remain deterministic under pressure.',
        ],
      },
      {
        heading: 'Control makes the public surface meaningful',
        paragraphs: [
          'A control surface only earns the name if it reveals a real gate. The live console matters because it exposes a system that can authorize, reroute, delay, throttle, or deny workloads before they start.',
          'That is why the category shift is from infrastructure optimization to execution control. Once the system can bind the outcome, the surrounding interface becomes evidence of authority rather than a decorative dashboard.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/console', label: 'Open the live control surface' },
      { href: '/methodology', label: 'Read the methodology' },
      { href: '/pricing', label: 'See commercial rollout' },
    ],
  },
  {
    slug: 'you-do-not-optimize-infrastructure-anymore-you-control-it',
    title: 'You do not optimize infrastructure anymore. You control it.',
    description:
      'The decisive category shift is from advisory optimization to binding execution control before workloads start.',
    publishedAt: '2026-04-03',
    releaseAt: '2026-04-03T09:00:00-04:00',
    readTime: '5 min read',
    summary:
      'Infrastructure control begins when the runtime follows a binding decision before execution. CO2 Router exists to make that shift explicit, inspectable, and operationally enforceable.',
    keywords: [
      'control infrastructure',
      'execution authority',
      'binding decisions',
      'control plane',
      'advisory vs control',
    ],
    coverImage: {
      src: '/blog/co2-router/co2routerslide11.png',
      alt: 'CO2 Router slide stating that infrastructure is no longer optimized after the fact but controlled before execution.',
      caption:
        'The product claim is not subtle: infrastructure stops being passively optimized and starts being actively controlled.',
    },
    sections: [
      {
        heading: 'The old model was advisory',
        paragraphs: [
          'Most systems in this category help operators understand what happened or what could have happened. They recommend. They compare. They forecast. They do not decide whether the workload may proceed.',
          'That is why they remain advisory even when the data is useful. Their outputs can inform an operator, but they do not control the runtime.',
        ],
      },
      {
        heading: 'The new model is authorization',
        paragraphs: [
          'CO2 Router is built around a gate, not a dashboard card. Carbon, water, latency, cost, and policy are evaluated before execution so the engine can return a single binding action.',
          'That action becomes the operational contract for downstream systems. The executor follows the decision rather than treating it as optional guidance.',
        ],
        figure: {
          src: '/blog/co2-router/co2routerslide10.png',
          alt: 'Comparison table showing CO2 Router as deterministic control rather than an advisory or informational system.',
          caption:
            'The public-safe comparison: CO2 Router is deterministic, multi-objective, proof-carrying, and real-time. Advisory systems are not.',
        },
      },
      {
        heading: 'Control requires proof, not just authority',
        paragraphs: [
          'A system that claims authority also has to defend what it did. That is why proof, replay, and trace matter. The value is not only that the engine made a decision. The value is that the decision can be inspected later without hand-waving.',
          'This is where the control plane category becomes durable. Once authority and proof travel together, the product is more than an optimization narrative.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/control-surface', label: 'Inspect the operator lane' },
      { href: '/methodology', label: 'Review the control-plane method' },
      { href: '/blog/why-dashboards-are-not-enough-from-reporting-to-enforcement', label: 'Read the dashboard critique' },
    ],
  },
  {
    slug: 'signals-become-one-binding-decision-path',
    title: 'Signals become one binding decision path',
    description:
      'Carbon, water, latency, cost, governance, policy, decision, and proof are turned into one bounded execution frame.',
    publishedAt: '2026-04-05',
    releaseAt: '2026-04-05T09:00:00-04:00',
    readTime: '6 min read',
    summary:
      'The engine is not a pile of disconnected inputs. It is a bounded sequence that turns multiple signals into one binding decision path with proof attached to the same frame.',
    keywords: [
      'signal normalization',
      'decision frame',
      'SAIQ governance',
      'policy and proof',
      'binding decision path',
    ],
    coverImage: {
      src: '/blog/co2-router/co2routerslide8.png',
      alt: 'CO2 Router diagram showing signals, SAIQ governance, policy, decision, and proof in one deterministic decision path.',
      caption:
        'The public version of the path: signals enter once, the engine resolves one frame, and proof remains attached all the way through.',
    },
    sections: [
      {
        heading: 'The input is multi-objective from the start',
        paragraphs: [
          'A real execution control plane cannot pretend carbon is the only thing that matters. Water stress, latency protection, cost posture, and policy all shape whether a decision is defensible in production.',
          'The engine therefore co-evaluates those dimensions before it ever returns an action. The objective is not a perfect scalar score. The objective is an admissible, bounded decision.',
        ],
        figure: {
          src: '/blog/co2-router/co2routerslide9.png',
          alt: 'CO2 Router diagram showing carbon, water, latency, and cost being evaluated together by the engine.',
          caption:
            'Carbon, water, latency, and cost are not separate dashboards. They are co-evaluated as one execution frame.',
        },
      },
      {
        heading: 'SAIQ governance shapes the frame before execution',
        paragraphs: [
          'SAIQ governance is where weighting, constraints, and zone posture are made explicit. That layer does not replace policy, but it does establish how the system should interpret the frame before execution.',
          'The result is a decision path that is explainable. The system can show why the frame was admissible, what constrained it, and how the final action emerged from the same bounded input.',
        ],
      },
      {
        heading: 'Proof is attached to the output, not reconstructed later',
        paragraphs: [
          'Once the engine returns an action, proof, trace state, replay posture, and provenance stay attached to the same frame. That is what turns a recommendation chain into authority infrastructure.',
          'The category only holds if the input path and the proof path stay joined. Otherwise the runtime and the explanation drift apart.',
        ],
        figure: {
          src: '/blog/co2-router/co2routerslide7.png',
          alt: 'CO2 Router visual showing five binding actions as the control output of the decision engine.',
          caption:
            'The control output is explicit: one request, one returned action, and the executor follows it before the workload starts.',
        },
      },
    ],
    relatedLinks: [
      { href: '/methodology', label: 'Read methodology' },
      { href: '/system/decision-engine', label: 'Inspect decision engine' },
      { href: '/system/replay', label: 'Inspect replay posture' },
    ],
  },
  {
    slug: 'signals-degrade-execution-authority-does-not',
    title: 'Signals degrade. Execution authority does not.',
    description:
      'Why mirrored caches, fallback discipline, and governance posture keep CO2 Router deterministic and auditable under provider degradation.',
    publishedAt: '2026-04-07',
    releaseAt: '2026-04-07T09:00:00-04:00',
    readTime: '6 min read',
    summary:
      'Provider degradation is not the same thing as loss of control. CO2 Router is built so that signal quality can degrade without forcing the system to fail open or abandon traceability.',
    keywords: [
      'signal degradation',
      'fallback discipline',
      'mirrored caches',
      'deterministic authority',
      'provider resilience',
    ],
    coverImage: {
      src: '/blog/co2-router/co2routerslide6.png',
      alt: 'CO2 Router slide showing degraded provider conditions with mirrored fallbacks and continued execution authority.',
      caption:
        'The resilience claim is bounded and explicit: signals may degrade, but the control plane does not fail open.',
    },
    sections: [
      {
        heading: 'A control plane cannot depend on perfect provider behavior',
        paragraphs: [
          'If live provider availability can collapse the decision path, the system does not really own execution authority. It is just relaying third-party uptime.',
          'That is why CO2 Router treats mirrored observations, cache warmth, and fallback discipline as part of the control-plane contract rather than incidental infrastructure detail.',
        ],
      },
      {
        heading: 'Fallback has to stay auditable',
        paragraphs: [
          'Fallback is not permission to invent certainty. When a provider degrades, the system must preserve what source mode it used, what freshness posture applied, and how confidence changed.',
          'This is where deterministic governance matters. The decision path must remain bounded and inspectable even when the signal posture is degraded.',
        ],
      },
      {
        heading: 'The system should never fail open',
        paragraphs: [
          'The important promise is not that every provider is always healthy. The important promise is that the system remains deterministic and auditable under degraded conditions.',
          'CO2 Router keeps execution authority intact by making cache posture, fallback discipline, and governance state visible rather than pretending degraded inputs are still pristine live signals.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/control-surface', label: 'Inspect provider posture' },
      { href: '/methodology', label: 'Read methodology' },
      { href: '/system/provenance', label: 'Inspect provenance and trace' },
    ],
  },
  {
    slug: 'pre-execution-control-without-the-bottleneck',
    title: 'Pre-execution control without the bottleneck',
    description:
      'Why a deterministic execution gate must stay inside strict latency budgets while still returning binding authority.',
    publishedAt: '2026-04-09',
    releaseAt: '2026-04-09T09:00:00-04:00',
    readTime: '5 min read',
    summary:
      'A control plane only works in production if it stays fast enough to sit in front of execution. CO2 Router is designed to authorize workloads inside bounded latency budgets instead of becoming a new runtime bottleneck.',
    keywords: [
      'latency budget',
      'pre-execution control',
      'fast path authorization',
      'deterministic latency',
      'execution bottleneck',
    ],
    coverImage: {
      src: '/blog/co2-router/co2routerslide3.png',
      alt: 'CO2 Router slide showing that deterministic pre-execution control runs within strict latency budgets.',
      caption:
        'Control only matters if it can sit in front of the workload without turning itself into the problem.',
    },
    sections: [
      {
        heading: 'The gate has to be fast enough to be real',
        paragraphs: [
          'A theoretical control plane that adds large unpredictable delay is not an execution layer. Operators will route around it. That is why latency posture is a product requirement, not just an engineering nicety.',
          'CO2 Router is built to resolve decisions inside bounded budgets so the runtime can honor the returned action without treating the control plane as a blocker.',
        ],
      },
      {
        heading: 'Speed does not remove multi-objective discipline',
        paragraphs: [
          'Fast path behavior only matters if it preserves the same decision semantics. Carbon, water, latency, cost, and policy still need to be resolved into one admissible action.',
          'The point is not to skip rigor. The point is to keep rigor compatible with real production traffic.',
        ],
        figure: {
          src: '/blog/co2-router/co2routerslide7.png',
          alt: 'Five binding actions returned by the CO2 Router control output.',
          caption:
            'Low-latency control still returns the same binding action set: run now, reroute, delay, throttle, or deny.',
        },
      },
      {
        heading: 'The result is infrastructure control, not workflow drag',
        paragraphs: [
          'Once the control plane can authorize quickly and defend the outcome later, it stops being a dashboard accessory and becomes real infrastructure.',
          'That is the point of pre-execution control without the bottleneck: preserve speed, preserve determinism, and keep proof attached to the same operational decision.',
        ],
      },
    ],
    relatedLinks: [
      { href: '/console', label: 'Open the console' },
      { href: '/system/decision-engine', label: 'Inspect the decision engine' },
      { href: '/pricing', label: 'See rollout lanes' },
    ],
  },
]

export function getPublishedBlogPosts(now = new Date()) {
  return blogPosts
    .filter((post) => isBlogPostPublished(post, now))
    .sort((left, right) => resolveReleaseAt(right).getTime() - resolveReleaseAt(left).getTime())
}

export function getBlogPost(slug: string, now = new Date()) {
  return getPublishedBlogPosts(now).find((post) => post.slug === slug) ?? null
}

export function getBlogPostOgImage(post: BlogPost) {
  return post.coverImage?.src ?? null
}
