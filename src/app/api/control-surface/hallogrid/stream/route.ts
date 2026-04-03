import { NextResponse } from 'next/server'

import { getHallOGridSnapshot } from '@/lib/control-surface/hallogrid'
import type { HallOGridStreamEvent } from '@/types/control-surface'

export const dynamic = 'force-dynamic'

const STREAM_INTERVAL_MS = 15_000

function encodeEvent(event: HallOGridStreamEvent) {
  return `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`
}

export async function GET(request: Request) {
  const encoder = new TextEncoder()
  let intervalId: ReturnType<typeof setInterval> | null = null

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const pushSnapshot = async () => {
        const snapshot = await getHallOGridSnapshot()
        controller.enqueue(encoder.encode(encodeEvent({ type: 'snapshot', snapshot })))
      }

      const stop = () => {
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
        try {
          controller.close()
        } catch {}
      }

      request.signal.addEventListener('abort', stop)

      try {
        await pushSnapshot()
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify({
              error: error instanceof Error ? error.message : 'Failed to stream HallOGrid snapshot',
            })}\n\n`
          )
        )
      }

      intervalId = setInterval(() => {
        void pushSnapshot().catch((error) => {
          controller.enqueue(
            encoder.encode(
              `event: error\ndata: ${JSON.stringify({
                error: error instanceof Error ? error.message : 'Failed to refresh HallOGrid snapshot',
              })}\n\n`
            )
          )
        })
      }, STREAM_INTERVAL_MS)
    },
    cancel() {
      if (intervalId) {
        clearInterval(intervalId)
      }
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
