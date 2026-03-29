import { NextResponse } from 'next/server'

import { getLiveSystemSnapshot } from '@/lib/control-surface/live-system'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const snapshot = await getLiveSystemSnapshot()
    return NextResponse.json(snapshot)
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to build live system snapshot',
      },
      { status: 500 }
    )
  }
}
