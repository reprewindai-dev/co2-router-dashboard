import { NextResponse } from 'next/server'

import { getHallOGridSnapshot } from '@/lib/control-surface/hallogrid'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const snapshot = await getHallOGridSnapshot()
    return NextResponse.json(snapshot, {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=5, stale-while-revalidate=10',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to build HallOGrid snapshot',
      },
      { status: 500 }
    )
  }
}
