import Link from 'next/link'

const problemPoints = [
  "whether it's the right time",
  "whether it's the right region",
  "whether it's efficient or wasteful",
  'whether it meets internal or external constraints',
]

const resultPoints = [
  'unnecessary cost',
  'inefficient execution',
  'fragmented policy enforcement',
  'no proof of why decisions were made',
]

const whatItDoes = [
  'Decides if a workload should run, delay, reroute, throttle, or stop',
  'Evaluates real-time conditions before execution',
  'Enforces policy across infrastructure environments',
  'Optimizes for cost, performance, and environmental impact automatically',
  'Generates proof of every decision for audit and reporting',
]

const integrationPoints = [
  'APIs and middleware',
  'CI/CD pipelines',
  'serverless environments',
  'containerized workloads',
  'schedulers and job queues',
]

const valuePoints = [
  'Reduced compute waste without manual tuning',
  'Better cost efficiency across workloads',
  'Consistent execution policies across environments',
  'Fewer bad or inefficient runs',
  'Verifiable proof for reporting and compliance',
]

const useCases = [
  'CI/CD pipelines -> delay or reroute builds intelligently',
  'Serverless workloads -> prevent inefficient execution',
  'Batch jobs -> run in optimal windows',
  'Multi-region systems -> route to the best location',
  'Enterprise environments -> enforce execution policies',
]

const whyNowPoints = [
  'more distributed',
  'more expensive',
  'more regulated',
]

const pressurePoints = [
  'workloads are increasing',
  'inefficiencies are compounding',
  'policies are harder to enforce',
]

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-base leading-8 text-slate-300">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-2 w-2 rounded-full bg-emerald-300/80" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="surface-card p-8 sm:p-10">
      <div className="max-w-4xl space-y-5">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{title}</h2>
        {children}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="space-y-10 pb-10">
      <section className="surface-card-strong overflow-hidden p-8 sm:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
          <div className="space-y-6">
            <div className="eyebrow">Section 1 - Hero</div>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
                CO2 Router: Control When and Where Your Compute Runs
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                Stop running workloads under the wrong conditions. CO2 Router evaluates every
                execution in real time - deciding whether it should run, wait, move, or stop -
                based on performance, cost, and environmental constraints.
              </p>
              <p className="max-w-3xl text-lg leading-8 text-slate-200">
                No blind execution. No wasted compute. Full control with proof.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/methodology"
                className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
              >
                View Architecture
              </Link>
              <Link
                href="#how-it-works"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
              >
                See How It Works
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/50">
            <div className="relative aspect-[16/10] overflow-hidden">
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster="/co2router-poster.svg"
              >
                <source src="/the-ai-making-the-cloud-greener.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Section 2 - The Problem" title="Compute runs blind.">
        <p className="text-lg leading-8 text-slate-300">
          Today, workloads are executed wherever they&apos;re sent - without evaluating:
        </p>
        <div className="pt-1">
          <BulletList items={problemPoints} />
        </div>
        <p className="text-lg leading-8 text-slate-300">The result:</p>
        <div className="pt-1">
          <BulletList items={resultPoints} />
        </div>
        <p className="text-lg leading-8 text-slate-300">
          Monitoring tools tell you what happened after the fact.
        </p>
        <p className="text-lg leading-8 text-slate-200">
          They don&apos;t stop bad execution from happening.
        </p>
      </Section>

      <Section
        eyebrow="Section 3 - The Shift"
        title="From monitoring compute -> to controlling it"
      >
        <p className="text-lg leading-8 text-slate-300">The industry is shifting from:</p>
        <p className="text-xl font-semibold text-white">&quot;run first, analyze later&quot;</p>
        <p className="text-lg leading-8 text-slate-300">To:</p>
        <p className="text-xl font-semibold text-white">&quot;evaluate first, then run&quot;</p>
        <p className="text-lg leading-8 text-slate-300">CO2 Router makes that shift real.</p>
        <p className="text-lg leading-8 text-slate-300">
          Before any workload executes, it is evaluated. If conditions aren&apos;t right, it
          doesn&apos;t run - or it runs somewhere better.
        </p>
        <p className="text-lg leading-8 text-slate-200">
          This is execution control, not optimization.
        </p>
      </Section>

      <Section eyebrow="Section 4 - What It Does" title="What CO2 Router does">
        <BulletList items={whatItDoes} />
        <p className="pt-2 text-lg leading-8 text-slate-200">
          All decisions happen in milliseconds, before execution begins.
        </p>
      </Section>

      <Section id="how-it-works" eyebrow="Section 5 - How It Works" title="How it works">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
          <div className="space-y-3 text-lg font-medium text-white">
            <div>Application / CI / Scheduler</div>
            <div className="font-mono text-sm text-slate-500">v</div>
            <div>CO2 Router</div>
            <div className="text-sm font-normal text-slate-400">(decision + policy layer)</div>
            <div className="font-mono text-sm text-slate-500">v</div>
            <div>Execution Target (cloud / region / queue)</div>
            <div className="font-mono text-sm text-slate-500">v</div>
            <div>Proof + telemetry returned</div>
          </div>
        </div>
        <ol className="space-y-3 pt-2 text-base leading-8 text-slate-300">
          <li>1. A workload requests execution</li>
          <li>2. CO2 Router evaluates it in real time</li>
          <li>3. A decision is returned instantly</li>
          <li>4. The workload executes accordingly</li>
          <li>5. A verifiable record is generated</li>
        </ol>
        <p className="text-lg leading-8 text-slate-200">
          Every workload becomes a controlled decision.
        </p>
      </Section>

      <Section eyebrow="Section 6 - Integrations" title="Works with your existing stack">
        <p className="text-lg leading-8 text-slate-300">
          CO2 Router integrates without requiring infrastructure rewrites.
        </p>
        <p className="text-lg leading-8 text-slate-300">It connects through:</p>
        <BulletList items={integrationPoints} />
        <p className="text-lg leading-8 text-slate-200">
          You don&apos;t replace your stack. You add control to it.
        </p>
      </Section>

      <Section eyebrow="Section 7 - Value" title="What this gives you">
        <BulletList items={valuePoints} />
        <p className="text-lg leading-8 text-slate-300">This is not just visibility.</p>
        <p className="text-lg leading-8 text-slate-200">It&apos;s control.</p>
      </Section>

      <Section eyebrow="Section 8 - Use Cases" title="Where CO2 Router is used">
        <BulletList items={useCases} />
        <p className="text-lg leading-8 text-slate-200">
          Anywhere compute runs, CO2 Router applies.
        </p>
      </Section>

      <Section eyebrow="Section 9 - Why Now" title="Why this is becoming required">
        <p className="text-lg leading-8 text-slate-300">Compute is becoming:</p>
        <BulletList items={whyNowPoints} />
        <p className="text-lg leading-8 text-slate-300">At the same time:</p>
        <BulletList items={pressurePoints} />
        <p className="text-lg leading-8 text-slate-300">
          The current model - execute first, analyze later - doesn&apos;t scale.
        </p>
        <p className="text-lg leading-8 text-slate-200">
          Execution must be controlled before it happens.
        </p>
        <p className="text-lg leading-8 text-slate-200">
          CO2 Router is built for that shift.
        </p>
      </Section>

      <Section eyebrow="Section 10 - Positioning Close" title="The new standard for compute">
        <p className="text-lg leading-8 text-slate-300">
          CO2 Router ensures that every workload runs under the right conditions - or not at all.
        </p>
        <p className="text-lg leading-8 text-slate-300">Not monitoring.</p>
        <p className="text-lg leading-8 text-slate-300">Not reporting.</p>
        <p className="text-2xl font-semibold text-white">Control.</p>
      </Section>

      <section className="surface-card-strong p-8 sm:p-10">
        <div className="max-w-4xl space-y-5">
          <div className="eyebrow">Section 11 - CTA</div>
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Start controlling your compute
          </h2>
          <p className="text-lg leading-8 text-slate-300">
            See how CO2 Router fits into your stack and what it can prevent before execution.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/methodology"
              className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
            >
              View Architecture
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Request Access
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
