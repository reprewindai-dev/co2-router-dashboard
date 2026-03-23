import { NextResponse } from 'next/server'

const DEFAULT_ENGINE_URL = 'https://ecobe-engineclaude-production.up.railway.app'
const FORWARDED_HEADERS = ['accept', 'content-type', 'authorization', 'x-request-id'] as const

function getEngineBaseUrl() {
  return process.env.ECOBE_API_URL || DEFAULT_ENGINE_URL
}

function shouldUseInternalKey(path: string[]) {
  const joined = path.join('/')
  return joined.startsWith('disclosure/') || joined.startsWith('system/')
}

async function proxy(request: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await ctx.params

  const engineBaseUrl = getEngineBaseUrl().replace(/\/$/, '')
  const url = new URL(request.url)

  const targetUrl = new URL(
    `${engineBaseUrl}/api/v1/${path.map(encodeURIComponent).join('/')}${url.search}`
  )

  const headers = new Headers()
  for (const header of FORWARDED_HEADERS) {
    const value = request.headers.get(header)
    if (value) headers.set(header, value)
  }

  if (shouldUseInternalKey(path)) {
    const internalKey = process.env.ECOBE_INTERNAL_API_KEY
    if (!internalKey) {
      return NextResponse.json(
        { error: 'Dashboard internal engine authentication is not configured.' },
        { status: 503 }
      )
    }
    headers.set('x-ecobe-internal-key', internalKey)
  }

  const res = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer(),
    redirect: 'manual',
  })

  return new NextResponse(res.body, {
    status: res.status,
    headers: res.headers,
  })
}

export async function GET(request: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(request, ctx)
}

export async function POST(request: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(request, ctx)
}

export async function PUT(request: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(request, ctx)
}

export async function PATCH(request: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(request, ctx)
}

export async function DELETE(request: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(request, ctx)
}
