'use client'

const runtimeTiles = [
  'AWS / Lambda',
  'Kubernetes',
  'Docker',
  'GitHub Actions',
  'Postgres',
  'Redis',
  'HTTP API',
  'Webhooks',
  'Queues / Jobs',
  'CI / CD',
]

export function IntegrationMarquee() {
  const items = [...runtimeTiles, ...runtimeTiles]

  return (
    <section className="surface-card overflow-hidden p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="eyebrow">Infrastructure footprint</div>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Runs across your existing infrastructure.</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-slate-300">
          One decision core, multiple control points. The runtime surface should feel connected to the systems buyers already trust.
        </p>
      </div>

      <div className="marquee-mask mt-6">
        <div className="marquee-track">
          {items.map((tile, index) => (
            <div
              key={`${tile}-${index}`}
              className="inline-flex min-w-[190px] items-center justify-center rounded-full border border-white/10 bg-slate-950/65 px-5 py-3 text-sm font-medium text-slate-100 shadow-[0_16px_40px_rgba(2,6,23,0.28)]"
            >
              {tile}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
