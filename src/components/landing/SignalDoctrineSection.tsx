'use client'

import { motion } from 'framer-motion'

import type { ControlSurfaceProviderNode } from '@/types/control-surface'

export function SignalDoctrineSection({
  providers,
}: {
  providers: ControlSurfaceProviderNode[]
}) {
  const waterProviders = providers.filter((provider) => provider.providerType === 'water')
  const verifiedWaterProviders = waterProviders.filter(
    (provider) => provider.provenanceStatus === 'verified'
  ).length
  const degradedProviders = providers.filter((provider) => provider.status !== 'healthy').length
  const mssPosture = degradedProviders > 0 ? 'degraded-safe' : 'live'
  const waterAuthorityPosture =
    verifiedWaterProviders > 0 ? 'verified authority attached' : 'authority tracked on frame'

  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300">
          Signal resilience / fallback discipline
        </div>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
          Signals degrade. Execution authority does not.
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
          Fallback discipline means degraded inputs must tighten posture instead of failing open.
          The persuasion lane explains the rule. The live operator lane carries the detailed
          provider state lower on the page.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[0.96fr_1.04fr]">
        <div className="grid gap-4">
          {[
            {
              title: 'Fallback discipline',
              body: 'If confidence, freshness, or provenance weakens, the engine lowers confidence and tightens doctrine instead of overstating a greener answer.',
            },
            {
              title: 'Verified authority',
              body: 'Water authority and source lineage remain attached to the same frame so the decision can be defended later.',
            },
            {
              title: 'Operator visibility',
              body: 'Detailed source health belongs in the operator lane, not inside the main persuasion story.',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-[28px] border border-white/8 bg-slate-950/60 p-5"
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-300">
                {item.title}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-[28px] border border-cyan-300/12 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.12),transparent_60%),rgba(2,8,23,0.84)] p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label: 'Current posture',
                value: mssPosture,
                detail: 'The signal fabric is either live or degrading safely under doctrine.',
              },
              {
                label: 'Fail-open policy',
                value: 'never',
                detail: 'We do not relax posture just because upstream inputs weaken.',
              },
              {
                label: 'Water authority',
                value: waterAuthorityPosture,
                detail: 'Verified water evidence stays in the same decision path when available.',
              },
              {
                label: 'Operator detail',
                value: 'below',
                detail: 'Provider-level status, traces, and verification remain in the live operator lane.',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  {item.label}
                </div>
                <div className="mt-2 text-2xl font-bold text-white">{item.value}</div>
                <div className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
