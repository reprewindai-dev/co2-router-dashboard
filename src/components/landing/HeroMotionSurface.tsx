'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

import { CO2RouterLogo } from '@/components/CO2RouterLogo'
import { formatAction } from '@/components/control-surface/action-styles'
import type { ControlSurfaceDecisionSummary } from '@/types/control-surface'

const flowNodes = [
  { left: '8%', top: '20%', size: 12 },
  { left: '22%', top: '64%', size: 8 },
  { left: '41%', top: '28%', size: 10 },
  { left: '58%', top: '70%', size: 12 },
  { left: '76%', top: '22%', size: 8 },
  { left: '90%', top: '58%', size: 10 },
]

export function HeroMotionSurface({
  liveDecision,
}: {
  liveDecision: ControlSurfaceDecisionSummary | null
}) {
  const actionMeta = liveDecision ? formatAction(liveDecision.action) : null

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_38%),linear-gradient(180deg,rgba(5,10,20,0.98),rgba(2,8,18,1))] px-6 py-10 shadow-[0_25px_120px_rgba(0,0,0,0.45)] sm:px-10 sm:py-12 lg:px-12 lg:py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(91,192,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(91,192,255,0.07)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
        <motion.div
          className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
          animate={{ opacity: [0.2, 0.75, 0.2], scaleX: [0.92, 1, 0.92] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {flowNodes.map((node, index) => (
          <motion.div
            key={`${node.left}-${node.top}`}
            className="absolute rounded-full bg-cyan-300/80"
            style={{ left: node.left, top: node.top, width: node.size, height: node.size }}
            animate={{
              opacity: [0.15, 0.85, 0.15],
              scale: [0.8, 1.15, 0.8],
            }}
            transition={{
              duration: 3.5 + index * 0.35,
              repeat: Infinity,
              delay: index * 0.25,
              ease: 'easeInOut',
            }}
          />
        ))}
        <motion.div
          className="absolute left-[-15%] top-[24%] h-[2px] w-[70%] origin-left rounded-full bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent"
          animate={{ x: ['-6%', '88%'] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-end">
        <div className="max-w-3xl">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <CO2RouterLogo size="lg" orientation="lockup" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl"
          >
            Authorize compute before it runs.
          </motion.h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            CO2 Router is the pre-execution enforcement layer that co-evaluates carbon, water,
            latency, cost, and policy in real time, then returns one binding action tied to a
            decision frame that can be inspected later.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/console"
              className="rounded-2xl bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-950 transition hover:brightness-105"
            >
              Open Control Surface
            </Link>
            <Link
              href="/methodology"
              className="rounded-2xl border border-cyan-300/20 bg-cyan-300/8 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/12"
            >
              Read Methodology
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_18px_80px_rgba(0,0,0,0.32)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
              Decision card
            </span>
            {actionMeta && (
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${actionMeta.badge}`}
              >
                {actionMeta.label}
              </span>
            )}
          </div>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Action</div>
              <div className="mt-2 text-2xl font-bold text-white">
                {actionMeta?.label ?? 'Run now'}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Region</div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {liveDecision?.selectedRegion ?? 'us-east1'}
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Carbon delta
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {(liveDecision?.carbonReductionPct ?? 0).toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="text-sm leading-7 text-slate-300">
              One decision frame, one selected region, and one binding action before execution.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
