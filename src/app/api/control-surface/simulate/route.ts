import { NextResponse } from 'next/server'

import { fetchEngineJson } from '@/lib/control-surface/engine'
import type { CiRouteResponse } from '@/types/control-surface'

export const dynamic = 'force-dynamic'

const allowedJobTypes = new Set(['standard', 'heavy', 'light'])
const allowedCriticality = new Set(['critical', 'standard', 'batch'])
const allowedPolicyProfiles = new Set([
  'default',
  'drought_sensitive',
  'eu_data_center_reporting',
  'high_water_sensitivity',
])

function normalizePayload(raw: unknown) {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Simulation payload must be an object')
  }

  const payload = raw as Record<string, unknown>
  const preferredRegions = Array.isArray(payload.preferredRegions)
    ? payload.preferredRegions.filter((region): region is string => typeof region === 'string' && region.trim().length > 0)
    : []

  const carbonWeight = Number(payload.carbonWeight)
  const waterWeight = Number(payload.waterWeight)
  const latencyWeight = Number(payload.latencyWeight)
  const costWeight = Number(payload.costWeight)
  const estimatedEnergyKwh = Number(payload.estimatedEnergyKwh)
  const jobType = String(payload.jobType ?? 'standard')
  const criticality = String(payload.criticality ?? 'standard')
  const waterPolicyProfile = String(payload.waterPolicyProfile ?? 'default')
  const allowDelay = Boolean(payload.allowDelay)

  if (!preferredRegions.length) throw new Error('At least one preferred region is required')
  if (![carbonWeight, waterWeight, latencyWeight, costWeight].every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) {
    throw new Error('Weights must be finite numbers between 0 and 1')
  }
  if (!Number.isFinite(estimatedEnergyKwh) || estimatedEnergyKwh <= 0) {
    throw new Error('estimatedEnergyKwh must be a positive number')
  }
  if (!allowedJobTypes.has(jobType)) throw new Error('Invalid jobType')
  if (!allowedCriticality.has(criticality)) throw new Error('Invalid criticality')
  if (!allowedPolicyProfiles.has(waterPolicyProfile)) throw new Error('Invalid waterPolicyProfile')

  return {
    preferredRegions,
    carbonWeight,
    waterWeight,
    latencyWeight,
    costWeight,
    jobType,
    criticality,
    waterPolicyProfile,
    allowDelay,
    estimatedEnergyKwh,
  }
}

export async function POST(request: Request) {
  try {
    const payload = normalizePayload(await request.json())
    const data = await fetchEngineJson<CiRouteResponse>('/ci/route', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Simulation failed' },
      { status: 400 }
    )
  }
}
