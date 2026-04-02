import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const ECOBE_ENGINE_URL =
  process.env.ECOBE_API_URL ||
  process.env.CO2ROUTER_API_URL ||
  "http://localhost:3000"

const ECOBE_ENGINE_API_KEY =
  process.env.DEKES_API_KEY ||
  process.env.ECOBE_API_KEY ||
  process.env.CO2ROUTER_API_KEY

async function fetchFromEngine(path: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (ECOBE_ENGINE_API_KEY) {
    headers.Authorization = `Bearer ${ECOBE_ENGINE_API_KEY}`
  }

  const response = await fetch(`${ECOBE_ENGINE_URL}/api/v1${path}`, {
    method: "GET",
    headers,
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`ECOBE Engine error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

type DecisionCountEnvelope = {
  totalDecisions?: number
  totalRequests?: number
  dataSource?: string
  dataStatus?: string
  projectionLagSec?: number
  latestProjectionAt?: string | null
  latestCanonicalAt?: string | null
  summary?: {
    totals?: {
      decisionCount?: number
      requestCount?: number
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const daysParam = searchParams.get("days") || "30"
    const days = Number.parseInt(daysParam, 10)
    const safeDays = Number.isFinite(days) && days > 0 ? days : 30

    const [ledger, decisionEnvelope] = await Promise.all([
      fetchFromEngine(`/dashboard/carbon-ledger-summary?days=${encodeURIComponent(String(safeDays))}`),
      safeDays <= 7
        ? fetchFromEngine(`/dashboard/metrics?window=${safeDays <= 1 ? "24h" : "7d"}`)
        : fetchFromEngine("/dashboard/impact-report?window=30d"),
    ])

    const typedDecisionEnvelope = decisionEnvelope as DecisionCountEnvelope
    const truthfulDecisionCount =
      typedDecisionEnvelope.totalDecisions ??
      typedDecisionEnvelope.summary?.totals?.decisionCount ??
      (ledger as Record<string, unknown>).totalJobsRouted

    const truthfulRequestCount =
      typedDecisionEnvelope.totalRequests ??
      typedDecisionEnvelope.summary?.totals?.requestCount ??
      truthfulDecisionCount

    return NextResponse.json({
      ...ledger,
      totalJobsRouted: truthfulDecisionCount,
      totalRequestsCounted: truthfulRequestCount,
      countedPath: "decision_surfaces",
      countedPathWindow: safeDays <= 1 ? "24h" : safeDays <= 7 ? "7d" : "30d",
      decisionDataSource: typedDecisionEnvelope.dataSource ?? null,
      decisionDataStatus: typedDecisionEnvelope.dataStatus ?? null,
      projectionLagSec: typedDecisionEnvelope.projectionLagSec ?? null,
      latestProjectionAt: typedDecisionEnvelope.latestProjectionAt ?? null,
      latestCanonicalAt: typedDecisionEnvelope.latestCanonicalAt ?? null,
    })
  } catch (error) {
    console.error("KPIs API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch KPI data" },
      { status: 500 }
    )
  }
}