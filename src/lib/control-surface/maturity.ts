import type { MaturityLane } from '@/types/control-surface'

export const publicMaturityLanes: MaturityLane[] = [
  {
    label: 'CI wedge',
    state: 'production_ready',
    detail:
      'Pre-execution authorization, deterministic action output, and canonical decision persistence are live now.',
  },
  {
    label: 'Control surface',
    state: 'strongest_today',
    detail:
      'The operator lane is strongest today for live decision review, provider posture, proof visibility, and replay inspection.',
  },
  {
    label: 'Governance / doctrine',
    state: 'strongest_today',
    detail:
      'SAIQ governance is active, policy-first evaluation is live, and trust/explanation surfaces now reflect the same canonical doctrine.',
  },
  {
    label: 'Proof / replay',
    state: 'strongest_today',
    detail:
      'Trace-backed replay and exportable proof packets are already part of the current decision path.',
  },
  {
    label: 'Signed delivery',
    state: 'roadmap',
    detail:
      'Signed event delivery exists in the canonical outbox path and is being tightened into a first-class certification surface.',
  },
  {
    label: 'Runtime adapters',
    state: 'experimental',
    detail:
      'Adapter breadth is real, but runtime-specific rollout quality still varies and remains bounded publicly until each wedge is stable.',
  },
  {
    label: 'Data foundation',
    state: 'roadmap',
    detail:
      'Bronze-to-platinum lineage artifacts now map the live system, with certification and operational exposure still being hardened.',
  },
]

export const maturityStateOrder: Array<MaturityLane['state']> = [
  'production_ready',
  'strongest_today',
  'roadmap',
  'experimental',
]

export const maturityStateLabels: Record<MaturityLane['state'], string> = {
  production_ready: 'Production-ready',
  strongest_today: 'Strongest today',
  roadmap: 'Roadmap',
  experimental: 'Experimental',
}
