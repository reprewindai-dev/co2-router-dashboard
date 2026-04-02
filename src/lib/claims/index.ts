import registry from './registry.json'

export type ClaimStatus = 'SAFE' | 'LABEL' | 'VERIFY'
export type ClaimSurface =
  | 'homepage'
  | 'console'
  | 'roadmap'
  | 'investor'
  | 'technical'
  | 'docs'
  | 'sales'

export interface CertifiedClaim {
  id: string
  claim: string
  status: ClaimStatus
  support: string
  evidenceSource: string
  allowedSurfaces: ClaimSurface[]
  requiredQualifier: string | null
  freshnessRule: string | null
}

type ClaimRegistry = {
  schemaVersion: number
  generatedAt: string
  claims: CertifiedClaim[]
}

const typedRegistry = registry as ClaimRegistry

export const CLAIM_REGISTRY_VERSION = typedRegistry.schemaVersion
export const CLAIM_REGISTRY_GENERATED_AT = typedRegistry.generatedAt
export const claimRegistry = typedRegistry.claims

export function getClaim(id: string) {
  return claimRegistry.find((claim) => claim.id === id) ?? null
}

export function formatClaimForPublication(claim: CertifiedClaim) {
  if (claim.status === 'LABEL' && claim.requiredQualifier) {
    return `${claim.claim} (${claim.requiredQualifier})`
  }

  return claim.claim
}

export function getClaimsForSurface(surface: ClaimSurface, options?: { includeVerify?: boolean }) {
  return claimRegistry.filter((claim) => {
    if (!options?.includeVerify && claim.status === 'VERIFY') return false
    return claim.allowedSurfaces.includes(surface)
  })
}

export function getClaimsByIds(ids: string[]) {
  return ids
    .map((id) => getClaim(id))
    .filter((claim): claim is CertifiedClaim => Boolean(claim))
}

export function getFeaturedClaimsForSurface(surface: ClaimSurface) {
  const featuredIdsBySurface: Record<ClaimSurface, string[]> = {
    homepage: [
      'five_binding_actions',
      'policy_order_precedes_carbon',
      'proof_hash_per_decision',
      'replay_verified_decisions',
    ],
    console: [
      'five_binding_actions',
      'policy_order_precedes_carbon',
      'proof_hash_per_decision',
      'replay_verified_decisions',
    ],
    roadmap: [
      'five_binding_actions',
      'replay_verified_decisions',
      'csrd_ready_records',
      'billing_non_blocking',
    ],
    investor: [
      'five_binding_actions',
      'policy_order_precedes_carbon',
      'proof_hash_per_decision',
      'billing_non_blocking',
    ],
    technical: [
      'current_total_budget_live',
      'current_compute_budget_live',
      'current_carbon_example',
      'current_water_example',
      'current_prisma_47_14',
      'eia_930_ingestion',
    ],
    docs: [
      'proof_hash_per_decision',
      'replay_verified_decisions',
      'csrd_ready_records',
      'tam_600b_estimate',
    ],
    sales: [
      'five_binding_actions',
      'billing_non_blocking',
      'csrd_ready_records',
    ],
  }

  return getClaimsByIds(featuredIdsBySurface[surface]).filter((claim) =>
    claim.status === 'VERIFY' ? false : claim.allowedSurfaces.includes(surface)
  )
}
