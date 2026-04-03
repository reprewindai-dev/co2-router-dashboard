import { NextResponse } from 'next/server'

import { getHallOGridFrameDetail } from '@/lib/control-surface/hallogrid'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  context: { params: Promise<{ decisionFrameId: string }> }
) {
  try {
    const { decisionFrameId } = await context.params
    const detail = await getHallOGridFrameDetail(decisionFrameId)

    if (!detail) {
      return NextResponse.json({ error: 'HallOGrid frame not found' }, { status: 404 })
    }

    return NextResponse.json(detail, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to build HallOGrid frame detail',
      },
      { status: 500 }
    )
  }
}
