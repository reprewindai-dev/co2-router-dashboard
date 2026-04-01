'use client'

import Link from 'next/link'

const comparisonRows = [
  {
    title: 'Visibility systems',
    body: 'Dashboards expose state, but the workload still runs somewhere else. CO2 Router sits at the control point and decides before execution starts.',
  },
  {
    title: 'Optimization systems',
    body: 'Schedulers can recommend or place work, but they do not govern carbon, water, latency, cost, and policy together on the same record.',
  },
  {
    title: 'Audit systems',
    body: 'Logs can prove a record existed after the fact. CO2 Router binds the action, doctrine state, and evidence to the same governed event up front.',
  },
] as const

export function CategoryDifferenceSection() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.96fr_1.04fr]">
        <div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300">
            Why existing systems stop short
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            Most systems report, recommend, or schedule.
            <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              CO2 Router enforces.
            </span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
            The difference is not better reporting. The difference is that CO2 Router makes the
            decision before compute starts and keeps the governed record attached afterward.
          </p>

          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <div>Dashboards stop at visibility.</div>
            <div>Schedulers stop at placement.</div>
            <div>Audit logs stop at records.</div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/methodology"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-cyan-300/40 hover:text-cyan-200"
            >
              Read full comparison
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {comparisonRows.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-white/10 bg-slate-950/68 p-5 shadow-[0_18px_90px_rgba(0,0,0,0.22)]"
            >
              <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">
                {item.title}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
