'use client'

import { motion } from 'framer-motion'

import type { ReplayBundle } from '@/types/control-surface'

export function ProofMoatSection({
  replay,
}: {
  replay: ReplayBundle | null
}) {
  const hasProofRecord = Boolean(replay?.persisted?.proofRecord ?? replay?.replay.proofRecord)
  const replayStatus = replay?.deterministicMatch
    ? 'Replay currently returns a deterministic match.'
    : replay
      ? 'Replay remains available on persisted decision frames.'
      : 'Replay becomes available when a frame is persisted.'

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="text-[11px] uppercase tracking-[0.28em] text-emerald-300">
          Proof / replay / evidence
        </div>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
          Evidence stays attached to the governed record.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Proof is not a separate reporting layer. The decision frame carries the operating reason,
          the policy state, and the replay path needed to inspect the same control event later.
        </p>
        <div className="mt-6 grid gap-3">
          {[
            'Baseline and selected outcomes stay attached to the same decision frame.',
            'Doctrine state remains inspectable after execution rather than reconstructed later.',
            'Replay checks whether the engine still reaches the same binding result from stored inputs.',
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/8 bg-slate-950/60 px-4 py-3 text-sm leading-7 text-slate-300"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-cyan-300/16 bg-slate-950/72 p-6 shadow-[0_24px_120px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300">
            Evidence surface
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-slate-300">
            {hasProofRecord ? 'governed record attached' : 'awaiting persisted frame'}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            {
              title: 'Decision frame',
              value: 'One frame binds the action, doctrine state, and evidence chain.',
            },
            {
              title: 'Replay posture',
              value: replayStatus,
            },
            {
              title: 'Provenance',
              value: 'Source lineage and water authority remain attached to the same governed event.',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {item.title}
              </div>
              <div className="mt-3 text-sm leading-7 text-slate-300">{item.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
