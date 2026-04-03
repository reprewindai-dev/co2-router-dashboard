'use client'

import { formatDistanceToNowStrict } from 'date-fns'
import { Activity, Globe2, Lock, Radar, RefreshCw, X } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { ACTION_META } from '@/components/control-surface/action-styles'
import { useHallOGridFrame, useHallOGridSnapshot } from '@/lib/hooks/control-surface'
import type {
  HallOGridFrame,
  HallOGridFrameDetail,
  WorldRegionState,
  WorldRoutingFlow,
} from '@/types/control-surface'

type Panel = 'trace' | 'replay' | 'proof'

const HEADER_HEIGHT = 58
const STRIP_HEIGHT = 34
const SCENE_TOP = HEADER_HEIGHT + STRIP_HEIGHT + 12

const P = {
  bg0: '#050608',
  bg1: '#0b0d14',
  bg2: '#10131c',
  glass: 'rgba(12,14,22,0.68)',
  glass2: 'rgba(20,23,34,0.82)',
  border: 'rgba(255,255,255,0.08)',
  borderLit: 'rgba(255,255,255,0.14)',
  t0: '#eef0fa',
  t1: '#b4bad0',
  t2: '#687294',
  t3: '#3a4168',
  accent: '#4d8dff',
}

const A: Record<HallOGridFrame['action'], string> = {
  run_now: '#00e68a',
  reroute: '#ffb833',
  delay: '#a78bfa',
  throttle: '#7c9dff',
  deny: '#ff4d6a',
}

const TABS = [
  ['trace', 'Trace', Activity],
  ['replay', 'Replay', RefreshCw],
  ['proof', 'Proof', Lock],
] as const

const hex = (c: string, o: number) => `${c}${Math.round(o * 255).toString(16).padStart(2, '0')}`

const ago = (v: string) => {
  try {
    return formatDistanceToNowStrict(new Date(v), { addSuffix: true })
  } catch {
    return v
  }
}

const ms = (v: number | null | undefined) => (v == null ? 'Unavailable' : `${v.toFixed(0)}ms`)
const liters = (v: number | null | undefined) =>
  v == null ? 'Unavailable' : `${v > 0 ? '+' : ''}${Math.abs(v) >= 10 ? v.toFixed(0) : v.toFixed(1)} L`
const shortHash = (v: string | null | undefined, len = 20) =>
  !v ? 'Unavailable' : v.length <= len ? v : `${v.slice(0, len)}...`
const confidenceGrade = (v: number | null | undefined) =>
  v == null ? '--' : v >= 90 ? 'A' : v >= 80 ? 'B' : v >= 70 ? 'C' : 'D'

function worldStateColor(node: WorldRegionState) {
  if (node.action && node.action in A) return A[node.action as HallOGridFrame['action']]
  if (node.state === 'active') return A.run_now
  if (node.state === 'marginal') return A.reroute
  return A.deny
}

function confidenceColor(value: number | null | undefined) {
  if (value == null) return P.t2
  if (value >= 85) return A.run_now
  if (value >= 68) return A.reroute
  return A.deny
}

function BackgroundGrid({ active, color }: { active: boolean; color: string }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '-25%',
          width: '150%',
          height: '150%',
          backgroundSize: '50px 50px',
          backgroundImage:
            'linear-gradient(to right, rgba(100,140,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,140,255,0.04) 1px, transparent 1px)',
          transform: 'rotateX(65deg) scale(2)',
          transformOrigin: 'top center',
          opacity: active ? 0.9 : 0.35,
          transition: 'opacity 1s ease, filter 1s ease',
          filter: active ? `drop-shadow(0 0 30px ${hex(color, 0.15)})` : 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 70% 40% at 50% 0%, ${hex(P.accent, 0.07)} 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 80% 90%, ${hex(A.run_now, 0.04)} 0%, transparent 50%), radial-gradient(ellipse 40% 40% at 15% 70%, ${hex(A.delay, 0.03)} 0%, transparent 50%)`,
          opacity: active ? 1.1 : 0.72,
        }}
      />
      {active ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${hex(color, 0.06)} 0%, transparent 60%)`,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          width: '180vw',
          height: '180vh',
          top: '-40%',
          left: '-40%',
          background: `radial-gradient(circle at 50% 50%, ${hex(P.accent, 0.03)} 0%, transparent 35%)`,
          animation: 'hallogrid-breathe 14s ease-in-out infinite',
        }}
      />
    </div>
  )
}

function HeaderBar({
  title,
  subtitle,
  streamHealthy,
  generatedAt,
}: {
  title: string
  subtitle: string
  streamHealthy: boolean
  generatedAt: string
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 120,
        height: HEADER_HEIGHT,
        padding: '0 20px',
        background: `linear-gradient(180deg, ${P.bg1}f2 0%, ${P.bg1}cf 100%)`,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: `1px solid ${P.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: 8, height: 8, borderRadius: '999px', background: A.run_now }} />
          <div
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: '999px',
              background: hex(A.run_now, 0.35),
              animation: 'hallogrid-pulse 2.5s ease-in-out infinite',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--m)', fontSize: 11, letterSpacing: '0.12em' }}>
            <span style={{ color: P.t0, fontWeight: 700 }}>CO2 ROUTER</span>
            <span style={{ padding: '3px 9px', borderRadius: 999, border: `1px solid ${hex(P.accent, 0.28)}`, background: hex(P.accent, 0.08), color: '#dbeafe' }}>CONSOLE</span>
            <span style={{ color: P.accent }}>HALLOGRID</span>
          </div>
          <div style={{ color: P.t2, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title} | {subtitle}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 999, border: `1px solid ${streamHealthy ? hex(A.run_now, 0.24) : hex(A.reroute, 0.28)}`, background: streamHealthy ? hex(A.run_now, 0.08) : hex(A.reroute, 0.1), color: streamHealthy ? '#d1fae5' : '#fde68a', fontFamily: 'var(--m)', fontSize: 10, letterSpacing: '0.08em' }}>
          <Radar size={12} />
          {streamHealthy ? 'LIVE MIRROR' : 'FALLBACK PATH'}
        </div>
        <div style={{ color: P.t2, fontFamily: 'var(--m)', fontSize: 10, letterSpacing: '0.06em' }}>
          REFRESHED {ago(generatedAt)}
        </div>
      </div>
    </div>
  )
}

function TelemetryStrip({ frames }: { frames: HallOGridFrame[] }) {
  const s = useMemo(() => {
    const counts = { run_now: 0, deny: 0, reroute: 0, delay: 0, throttle: 0 }
    let lat = 0
    let latN = 0
    let conf = 0
    let confN = 0
    frames.forEach((f) => {
      counts[f.action] += 1
      if (f.metrics.totalLatencyMs != null) {
        lat += f.metrics.totalLatencyMs
        latN += 1
      }
      if (f.metrics.signalConfidence != null) {
        conf += f.metrics.signalConfidence
        confN += 1
      }
    })
    return { ...counts, latency: latN ? Math.round(lat / latN) : null, confidence: confN ? conf / confN : null }
  }, [frames])

  const items = [
    { key: 'run_now', label: 'RUN NOW', value: s.run_now, color: A.run_now, pulse: s.run_now > 0 },
    { key: 'deny', label: 'DENY', value: s.deny, color: A.deny, pulse: false },
    { key: 'reroute', label: 'REROUTE', value: s.reroute, color: A.reroute, pulse: false },
    { key: 'delay', label: 'DELAY', value: s.delay, color: A.delay, pulse: false },
    { key: 'throttle', label: 'THROTTLE', value: s.throttle, color: A.throttle, pulse: false },
  ] as const

  return (
    <div
      style={{
        position: 'fixed',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 118,
        height: STRIP_HEIGHT,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        borderBottom: `1px solid ${P.border}`,
        background: `linear-gradient(180deg, ${P.bg2}ed 0%, ${P.bg1}cf 100%)`,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, overflowX: 'auto', scrollbarWidth: 'none', fontFamily: 'var(--m)', fontSize: 10, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
        {items.map((item) => {
          const active = item.value > 0
          return (
            <div key={item.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: active ? item.color : hex(item.color, 0.56), textShadow: item.pulse ? `0 0 12px ${hex(item.color, 0.42)}` : 'none' }}>
              <span style={{ fontWeight: 700, animation: item.pulse ? 'hallogrid-pulse-soft 2.6s ease-in-out infinite' : 'none' }}>{item.value}</span>
              <span style={{ color: active ? P.t1 : P.t3 }}>{item.label}</span>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, color: P.t2, fontFamily: 'var(--m)', fontSize: 10, letterSpacing: '0.08em' }}>
        <span style={{ color: '#dbeafe' }}>{s.latency != null ? `${s.latency}MS` : 'LAT N/A'}</span>
        <span style={{ color: confidenceColor(s.confidence), fontWeight: 700 }}>
          CONF {s.confidence != null ? s.confidence.toFixed(1) : '--'}
        </span>
      </div>
    </div>
  )
}

function FeedCard({
  f,
  active,
  anyActive,
  onTap,
}: {
  f: HallOGridFrame
  active: boolean
  anyActive: boolean
  onTap: (id: string) => void
}) {
  const c = A[f.action]
  const meta = ACTION_META[f.action]
  const conf = f.metrics.signalConfidence
  const confColor = confidenceColor(conf)

  return (
    <button
      type="button"
      onClick={() => onTap(f.id)}
      style={{
        cursor: 'pointer',
        width: '100%',
        padding: '16px 18px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'left',
        background: active ? `linear-gradient(145deg, ${hex(c, 0.14)} 0%, ${P.glass2} 100%)` : P.glass,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `1px solid ${active ? hex(c, 0.5) : P.border}`,
        borderRadius: 14,
        boxShadow: active ? `0 0 30px ${hex(c, 0.2)}, 0 8px 32px rgba(0,0,0,0.52), inset 0 1px 0 ${hex(c, 0.15)}` : '0 4px 20px rgba(0,0,0,0.4)',
        transform: active ? 'scale(1.02) translateZ(40px)' : anyActive ? 'scale(0.98)' : 'scale(1)',
        opacity: anyActive && !active ? 0.44 : 1,
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}
      aria-expanded={active}
    >
      <div style={{ position: 'absolute', left: 0, top: 10, bottom: 10, width: 3, borderRadius: 999, background: c, boxShadow: active ? `0 0 16px ${hex(c, 0.7)}` : `0 0 8px ${hex(c, 0.4)}` }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--m)', fontSize: 10, color: P.t2, letterSpacing: '0.05em' }}>{f.id}</span>
        <div style={{ fontFamily: 'var(--m)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: c, padding: '3px 12px', borderRadius: 999, background: hex(c, 0.12), border: `1px solid ${hex(c, 0.25)}` }}>{meta.label.toUpperCase()}</div>
      </div>
      <div style={{ paddingLeft: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: P.t0, letterSpacing: '-0.01em' }}>{f.explanation.headline}</div>
        <div style={{ fontSize: 11, color: P.t2, marginTop: 3 }}>
          {f.region} | {f.workloadClass}
          {f.trust.degraded ? <span style={{ color: A.reroute, marginLeft: 8 }}>guarded</span> : null}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingLeft: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(circle at 30% 30%, ${hex(confColor, 0.24)} 0%, ${hex(confColor, 0.08)} 100%)`, border: `1.5px solid ${hex(confColor, 0.45)}`, boxShadow: `0 0 12px ${hex(confColor, 0.2)}` }}>
            <span style={{ fontFamily: 'var(--m)', fontSize: 10, fontWeight: 700, color: confColor }}>{confidenceGrade(conf)}</span>
          </div>
          <div>
            <span style={{ fontFamily: 'var(--m)', fontSize: 13, fontWeight: 700, color: confColor }}>{conf != null ? conf.toFixed(1) : '--'}</span>
            <span style={{ fontFamily: 'var(--m)', fontSize: 9, color: P.t3, marginLeft: 4 }}>CONF</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {[f.traceState === 'locked', f.proofState === 'available', f.replayState === 'verified'].map((ok, index) => (
              <div key={index} style={{ width: 5, height: 5, borderRadius: '50%', background: ok ? A.run_now : A.deny, boxShadow: `0 0 5px ${hex(ok ? A.run_now : A.deny, 0.5)}` }} />
            ))}
            <span style={{ fontFamily: 'var(--m)', fontSize: 9, color: P.t3, marginLeft: 2 }}>proof</span>
          </div>
          <span style={{ fontFamily: 'var(--m)', fontSize: 10, color: P.t3 }}>{ms(f.metrics.totalLatencyMs)}</span>
          <span style={{ fontFamily: 'var(--m)', fontSize: 10, color: P.t3 }}>{ago(f.createdAt)}</span>
        </div>
      </div>
    </button>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 10, background: hex('#ffffff', 0.04), border: `1px solid ${P.border}` }}><div style={{ fontFamily: 'var(--m)', fontSize: 10, color: P.t3, letterSpacing: '0.08em', marginBottom: 8 }}>{title}</div>{children}</div>
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '5px 0' }}><span style={{ fontSize: 11, color: P.t2 }}>{label}</span><span style={{ fontSize: 11, color: color ?? P.t1, fontFamily: 'var(--m)', fontWeight: 500, textAlign: 'right' }}>{value}</span></div>
}

function Bar({ label, value }: { label: string; value: number | null | undefined }) {
  const amount = value ?? 0
  const width = Math.min(amount, 100)
  const color = amount >= 85 ? A.run_now : amount >= 70 ? A.reroute : A.deny

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: P.t2, textTransform: 'capitalize' }}>{label}</span>
        <span style={{ fontSize: 10, color: P.t2, fontFamily: 'var(--m)' }}>{value == null ? 'Unavailable' : value.toFixed(1)}</span>
      </div>
      <div style={{ height: 4, borderRadius: 3, background: hex('#ffffff', 0.04) }}>
        <div style={{ height: '100%', borderRadius: 3, width: `${width}%`, background: `linear-gradient(90deg, ${color}, ${hex(color, 0.6)})`, boxShadow: `0 0 10px ${hex(color, 0.35)}` }} />
      </div>
    </div>
  )
}

type ProjectedNode = {
  node: WorldRegionState
  screenX: number
  screenY: number
  depth: number
  opacity: number
  scale: number
  color: string
}

function GlobePanel({
  nodes,
  flows,
  selectedRegion,
  projectionLagSec,
  streamHealthy,
  expanded,
}: {
  nodes: WorldRegionState[]
  flows: WorldRoutingFlow[]
  selectedRegion: string | null
  projectionLagSec: number | null
  streamHealthy: boolean
  expanded: boolean
}) {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    const interval = window.setInterval(() => {
      setRotation((current) => (current + 0.65) % 360)
    }, 40)

    return () => window.clearInterval(interval)
  }, [])

  const globeSize = expanded ? 520 : 420
  const radius = expanded ? 200 : 160
  const center = globeSize / 2
  const glowRadius = radius + (expanded ? 10 : 8)

  const projected = useMemo<ProjectedNode[]>(() => {
    return nodes
      .map((node) => {
        const lon = (node.x / 100) * 360 - 180
        const lat = 90 - (node.y / 100) * 180
        const lonRad = ((lon + rotation) * Math.PI) / 180
        const latRad = (lat * Math.PI) / 180
        const x = Math.cos(latRad) * Math.sin(lonRad)
        const y = Math.sin(latRad)
        const z = Math.cos(latRad) * Math.cos(lonRad)

        return {
          node,
          screenX: center + radius * x,
          screenY: center - radius * y,
          depth: z,
          opacity: Math.max(0.16, 0.32 + ((z + 1) / 2) * 0.88),
          scale: 0.58 + ((z + 1) / 2) * 0.72,
          color: worldStateColor(node),
        }
      })
      .sort((a, b) => a.depth - b.depth)
  }, [nodes, rotation])

  const visibleByRegion = useMemo(() => new Map(projected.map((item) => [item.node.region, item])), [projected])

  const flowPaths = useMemo(() => {
    return flows
      .map((flow) => {
        const from = visibleByRegion.get(flow.fromRegion)
        const to = visibleByRegion.get(flow.toRegion)
        if (!from || !to) return null
        if (from.depth < 0.02 || to.depth < 0.02) return null

        const controlX = (from.screenX + to.screenX) / 2
        const controlY =
          Math.min(from.screenY, to.screenY) -
          24 -
          Math.abs(from.screenX - to.screenX) * 0.08 -
          Math.abs(from.screenY - to.screenY) * 0.06

        return {
          id: flow.id,
          d: `M ${from.screenX} ${from.screenY} Q ${controlX} ${controlY} ${to.screenX} ${to.screenY}`,
          color: flow.mode === 'blocked' ? A.deny : P.accent,
          opacity: Math.min(from.opacity, to.opacity) * (flow.mode === 'blocked' ? 0.9 : 0.72),
        }
      })
      .filter((item): item is NonNullable<typeof item> => item != null)
  }, [flows, visibleByRegion])

  const activeCount = nodes.filter((node) => node.state === 'active').length
  const blockedCount = nodes.filter((node) => node.state === 'blocked').length
  const selectedNode = selectedRegion ? nodes.find((node) => node.region === selectedRegion) ?? null : null

  return (
    <div style={{ padding: '18px 18px 16px', borderRadius: 24, background: `linear-gradient(180deg, ${hex(P.accent, 0.02)} 0%, ${hex(P.accent, 0.01)} 42%, ${hex('#020309', 0.92)} 76%, ${hex('#000000', 0.98)} 100%)`, border: `1px solid ${hex(P.accent, 0.12)}`, boxShadow: `0 24px 60px ${hex('#000000', 0.36)}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--m)', fontSize: 10, letterSpacing: '0.12em', color: '#dbeafe' }}>
            <Globe2 size={13} />
            LIVE GRID THEATER
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: P.t1 }}>
            Spinning world state with live routing lanes and selected-region emphasis.
          </div>
        </div>
        <div style={{ flexShrink: 0, padding: '6px 10px', borderRadius: 999, border: `1px solid ${streamHealthy ? hex(A.run_now, 0.2) : hex(A.reroute, 0.24)}`, background: streamHealthy ? hex(A.run_now, 0.08) : hex(A.reroute, 0.1), color: streamHealthy ? '#d1fae5' : '#fde68a', fontFamily: 'var(--m)', fontSize: 10, letterSpacing: '0.08em' }}>
          {streamHealthy ? 'STREAM HEALTHY' : 'STREAM GUARDED'}
        </div>
      </div>

        <div style={{ marginTop: 16, display: expanded ? 'flex' : 'grid', flexDirection: expanded ? 'column' : undefined, gridTemplateColumns: expanded ? undefined : 'minmax(0, 1fr) 170px', gap: expanded ? 16 : 14, alignItems: 'center' }}>
        <div style={{ position: 'relative', minHeight: expanded ? 440 : 320, borderRadius: 22, overflow: 'hidden', border: `1px solid ${P.borderLit}`, background: `radial-gradient(circle at 50% 38%,  0%,  46%,  100%)` }}>
          <div style={{ position: 'absolute', inset: expanded ? 22 : 18, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 22%, rgba(7,12,22,0.1) 55%, rgba(4,6,8,0.94) 100%)', boxShadow: `inset 0 0 36px , 0 0 22px ` }} />
          <svg viewBox={`0 0 ${globeSize} ${globeSize}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <filter id="hallogrid-flow-glow">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="hallogrid-globe-core" cx="50%" cy="50%" r="58%">
                <stop offset="0%" stopColor="rgba(20,28,46,0.02)" />
                <stop offset="45%" stopColor="rgba(8,12,24,0.06)" />
                <stop offset="72%" stopColor="rgba(2,4,10,0.55)" />
                <stop offset="100%" stopColor="rgba(0,1,4,0.9)" />
              </radialGradient>
              <radialGradient id="hallogrid-atmosphere" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="rgba(120,170,255,0.015)" />
                <stop offset="55%" stopColor="rgba(80,120,220,0.05)" />
                <stop offset="100%" stopColor="rgba(30,50,120,0.09)" />
              </radialGradient>
            </defs>
            <circle cx={center} cy={center} r={glowRadius} fill="url(#hallogrid-atmosphere)" />
            <circle cx={center} cy={center} r={radius} fill="url(#hallogrid-globe-core)" />
            <circle cx={center} cy={center} r={radius} fill="transparent" stroke={P.borderLit} strokeWidth="1.2" />
            {[0.18, 0.32, 0.46, 0.6, 0.74].map((ratio, index) => (
              <ellipse
                key={`lat-${ratio}`}
                cx={center}
                cy={center}
                rx={radius}
                ry={radius * ratio}
                fill="transparent"
                stroke={hex(P.accent, 0.28 - index * 0.03)}
                strokeWidth="0.8"
              />
            ))}
            {[0.18, 0.36, 0.54, 0.72].map((ratio, index) => (
              <ellipse
                key={`lon-${ratio}`}
                cx={center}
                cy={center}
                rx={radius * ratio}
                ry={radius}
                fill="transparent"
                stroke={hex(P.accent, 0.24 - index * 0.03)}
                strokeWidth="0.8"
                transform={`rotate(${rotation * (0.25 + index * 0.06)} ${center} ${center})`}
              />
            ))}
            {flowPaths.map((flow) => (
              <path key={flow.id} d={flow.d} fill="none" stroke={flow.color} strokeOpacity={flow.opacity} strokeWidth={1.7} filter="url(#hallogrid-flow-glow)" />
            ))}
            {projected.map((item) => {
              const isSelected = item.node.region === selectedRegion
              const isLive = item.node.state === 'active'
              const isMarginal = item.node.state === 'marginal'
              const beaconAnim = isLive ? 'hallogrid-beacon-fast 1.1s ease-in-out infinite' : isMarginal ? 'hallogrid-beacon-slow 2.6s ease-in-out infinite' : 'none'
              return (
                <g key={item.node.region} opacity={item.opacity}>
                  
                  <circle
                    cx={item.screenX}
                    cy={item.screenY}
                    r={5 * item.scale}
                    fill={item.color}
                    stroke={isSelected ? "#ffffff" : hex(item.color, 0.6)}
                    strokeWidth={isSelected ? 2 : 1}
                    filter="url(#hallogrid-flow-glow)"
                    style={{ animation: beaconAnim }}
                  />
                  
                  
                </g>
              )
            })}
          </svg>
          <div style={{ position: 'absolute', left: 16, bottom: 14, padding: '6px 10px', borderRadius: 999, background: hex('#000000', 0.38), border: `1px solid ${P.borderLit}`, fontFamily: 'var(--m)', fontSize: 10, letterSpacing: '0.08em', color: selectedNode ? worldStateColor(selectedNode) : '#dbeafe' }}>
            {selectedNode ? `SELECTED ${selectedNode.label.toUpperCase()}` : 'WORLD STATE LIVE'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: expanded ? 'row' : 'column', gap: 10, flexWrap: expanded ? 'wrap' : 'nowrap' }}>
          <Block title="ROUTING PULSE">
            <Row label="Active nodes" value={String(activeCount)} color={A.run_now} />
            <Row label="Blocked nodes" value={String(blockedCount)} color={blockedCount > 0 ? A.deny : P.t2} />
            <Row label="Route lanes" value={String(flows.length)} />
            <Row label="Projection lag" value={projectionLagSec == null ? 'Unavailable' : `${projectionLagSec}s`} color={projectionLagSec != null && projectionLagSec > 60 ? A.reroute : P.t1} />
          </Block>
          <Block title="SELECTED REGION">
            <div style={{ fontSize: 14, fontWeight: 700, color: P.t0 }}>{selectedNode ? selectedNode.label : 'No frame selected'}</div>
            <div style={{ fontSize: 11, color: P.t2, marginTop: 6, lineHeight: 1.6 }}>
              {selectedNode ? `Action ${selectedNode.action ?? 'n/a'} | reason ${selectedNode.reasonCode ?? 'n/a'}` : 'Choose a frame to lock the globe onto the routed region.'}
            </div>
          </Block>
        </div>
      </div>
    </div>
  )
}

function Inspector({
  f,
  detail,
  panel,
  setPanel,
  close,
  mobile,
  loading,
}: {
  f: HallOGridFrame
  detail: HallOGridFrameDetail | null
  panel: Panel
  setPanel: (p: Panel) => void
  close: () => void
  mobile: boolean
  loading: boolean
}) {
  const color = A[f.action]
  const conf = f.metrics.signalConfidence
  const confColor = confidenceColor(conf)
  const trace = detail?.evidence.trace
  const replay = detail?.evidence.replay
  const proof = detail?.evidence.proof

  return (
    <div style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: `linear-gradient(180deg, ${P.bg1}fa 0%, ${P.bg0}fa 100%)`, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
      <div style={{ padding: mobile ? '16px 18px 14px' : '20px 24px 16px', position: 'sticky', top: 0, zIndex: 10, background: `linear-gradient(180deg, ${P.bg1}f5 0%, ${P.bg1}d0 100%)`, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: `1px solid ${P.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--m)', fontSize: 10, color: P.t3, letterSpacing: '0.08em', marginBottom: 4 }}>{f.id} | {new Date(f.createdAt).toLocaleTimeString()}</div>
            <div style={{ fontSize: 21, fontWeight: 700, color: P.t0, letterSpacing: '-0.02em' }}>{f.explanation.headline}</div>
            <div style={{ fontSize: 12, color: P.t2, marginTop: 3 }}>{f.reasonLabel}</div>
          </div>
          <button type="button" onClick={close} style={{ background: hex('#ffffff', 0.05), border: `1px solid ${P.border}`, borderRadius: 8, color: P.t2, cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--m)', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color, padding: '7px 20px', borderRadius: 999, background: `linear-gradient(135deg, ${hex(color, 0.18)} 0%, ${hex(color, 0.06)} 100%)`, border: `1px solid ${hex(color, 0.35)}`, boxShadow: `0 0 20px ${hex(color, 0.25)}, inset 0 1px 0 ${hex(color, 0.15)}` }}>
            {ACTION_META[f.action].label.toUpperCase()}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(circle at 35% 35%, ${hex(confColor, 0.3)} 0%, ${hex(confColor, 0.08)} 100%)`, border: `2px solid ${hex(confColor, 0.5)}`, boxShadow: `0 0 18px ${hex(confColor, 0.25)}` }}>
              <span style={{ fontFamily: 'var(--m)', fontSize: 14, fontWeight: 700, color: confColor }}>{confidenceGrade(conf)}</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--m)', fontSize: 24, fontWeight: 700, color: confColor, lineHeight: 1 }}>{conf != null ? conf.toFixed(1) : '--'}</div>
              <div style={{ fontFamily: 'var(--m)', fontSize: 9, color: P.t3, letterSpacing: '0.08em' }}>CONF | {f.trust.tier}</div>
            </div>
          </div>

          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--m)', fontSize: 18, fontWeight: 600, color: P.t1 }}>{f.metrics.totalLatencyMs != null ? f.metrics.totalLatencyMs.toFixed(0) : '--'}<span style={{ fontSize: 10, color: P.t3 }}>ms</span></div>
            <div style={{ fontFamily: 'var(--m)', fontSize: 9, color: P.t3 }}>LATENCY</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {TABS.map(([id, label, Icon]) => (
            <button key={id} type="button" onClick={() => setPanel(id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999, border: `1px solid ${panel === id ? hex(P.accent, 0.32) : P.border}`, background: panel === id ? hex(P.accent, 0.12) : hex('#ffffff', 0.04), color: panel === id ? '#dbeafe' : P.t1, fontFamily: 'var(--m)', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer' }}>
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: mobile ? '0 18px' : '0 24px' }}>
        {loading ? (
          <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: `linear-gradient(135deg, ${hex(P.accent, 0.08)} 0%, ${hex(P.accent, 0.03)} 100%)`, border: `1px solid ${hex(P.accent, 0.15)}`, fontSize: 11, color: '#dbeafe' }}>
            Loading trace-backed detail...
          </div>
        ) : null}

        {panel === 'trace' ? (
          <>
            <Block title="DECISION CORE">
              <Row label="Frame" value={f.id} />
              <Row label="Region" value={f.region} />
              <Row label="Workload class" value={f.workloadClass} />
              <Row label="Action" value={ACTION_META[f.action].label} color={color} />
              <Row label="Signal mode" value={f.runtime.signalMode ?? 'Unavailable'} />
              <Row label="Accounting" value={f.runtime.accountingMethod ?? 'Unavailable'} />
              <Row label="Water delta" value={liters(f.metrics.waterImpactDeltaLiters)} />
            </Block>
            <Block title="CONFIDENCE BREAKDOWN">
              <Bar label="signal confidence" value={f.metrics.signalConfidence} />
              <Bar label="carbon reduction" value={f.metrics.carbonReductionPct} />
              <Bar label="replay readiness" value={f.replayState === 'verified' ? 100 : f.replayState === 'pending' ? 55 : 18} />
              <Bar label="proof posture" value={f.proofState === 'available' ? 100 : 20} />
            </Block>
            <Block title="GOVERNANCE / TRACE">
              <Row label="Governance source" value={trace?.governanceSource ?? f.governanceSource ?? 'Unavailable'} />
              <Row label="Trace hash" value={shortHash(trace?.hash)} />
              <Row label="Input hash" value={shortHash(trace?.inputHash)} />
              <Row label="Sequence" value={trace?.sequenceNumber != null ? String(trace.sequenceNumber) : 'Unavailable'} />
              <Row label="Constraints" value={trace?.constraintsApplied.length ? trace.constraintsApplied.join(', ') : 'none'} />
            </Block>
          </>
        ) : null}

        {panel === 'replay' ? (
          <>
            <Block title="REPLAY STATE">
              <Row label="Deterministic match" value={replay?.deterministicMatch == null ? 'Unavailable' : replay.deterministicMatch ? 'YES' : 'NO'} color={replay?.deterministicMatch == null ? P.t1 : replay.deterministicMatch ? A.run_now : A.deny} />
              <Row label="Trace backed" value={replay?.available ? (replay.traceBacked ? 'YES' : 'NO') : 'Unavailable'} />
              <Row label="Selected action" value={replay?.selectedAction ?? 'Unavailable'} />
              <Row label="Selected region" value={replay?.selectedRegion ?? 'Unavailable'} />
              <Row label="Reason code" value={replay?.reasonCode ?? f.reasonCode} />
            </Block>
            <Block title="REPLAY NOTES">
              {replay?.mismatches.length ? replay.mismatches.map((mismatch) => (
                <div key={mismatch} style={{ marginTop: 8, padding: '10px 12px', borderRadius: 8, background: hex(A.deny, 0.08), border: `1px solid ${hex(A.deny, 0.16)}`, color: '#fecdd3', fontSize: 11 }}>
                  {mismatch}
                </div>
              )) : <div style={{ fontSize: 11, color: P.t2, lineHeight: 1.7 }}>{f.trust.replayability}</div>}
            </Block>
          </>
        ) : null}

        {panel === 'proof' ? (
          <>
            <Block title="TRACE ENVELOPE">
              <Row label="Proof hash" value={shortHash(proof?.hash, 24)} />
              <Row label="Not before" value={proof?.notBefore ?? 'Immediate'} />
              <Row label="Trace state" value={f.traceState} />
              <Row label="Proof state" value={f.proofState} color={f.proofState === 'available' ? A.run_now : A.reroute} />
            </Block>
            <Block title="EVIDENCE REFS">
              {proof?.providerSnapshotRefs.length ? proof.providerSnapshotRefs.slice(0, 3).map((ref) => (
                <div key={ref} style={{ marginTop: 8, padding: '10px 12px', borderRadius: 8, background: hex(P.accent, 0.06), border: `1px solid ${hex(P.accent, 0.14)}`, color: P.t1, fontFamily: 'var(--m)', fontSize: 10, overflowWrap: 'anywhere' }}>
                  {ref}
                </div>
              )) : null}
              {proof?.evidenceRefs.length ? proof.evidenceRefs.slice(0, 3).map((ref) => (
                <div key={ref} style={{ marginTop: 8, padding: '10px 12px', borderRadius: 8, background: hex(A.run_now, 0.06), border: `1px solid ${hex(A.run_now, 0.14)}`, color: P.t1, fontFamily: 'var(--m)', fontSize: 10, overflowWrap: 'anywhere' }}>
                  {ref}
                </div>
              )) : null}
              {!proof?.providerSnapshotRefs.length && !proof?.evidenceRefs.length ? (
                <div style={{ fontSize: 11, color: P.t3, fontStyle: 'italic' }}>No linked evidence refs returned.</div>
              ) : null}
            </Block>
          </>
        ) : null}

        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}

export function CommandCenterShell() {
  const snapshotQuery = useHallOGridSnapshot()
  const snapshot = snapshotQuery.data

  const [sel, setSel] = useState<string | null>(null)
  const [seededSelection, setSeededSelection] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [panel, setPanel] = useState<Panel>('trace')

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 960)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!snapshot || seededSelection) return
    const initial = snapshot.selectedFrameId ?? snapshot.frames[0]?.id ?? null
    if (initial) setSel(initial)
    setSeededSelection(true)
  }, [seededSelection, snapshot])

  useEffect(() => {
    if (!snapshot || !sel) return
    if (!snapshot.frames.some((frame) => frame.id === sel)) setSel(null)
  }, [sel, snapshot])

  const frame = useMemo(() => {
    if (!snapshot || !sel) return null
    return snapshot.frames.find((item) => item.id === sel) ?? null
  }, [snapshot, sel])

  const isPrimary = Boolean(snapshot?.selectedFrameId && sel === snapshot.selectedFrameId)
  const detailQuery = useHallOGridFrame(sel, { enabled: Boolean(sel) && !isPrimary, refetchInterval: false })
  const detail = isPrimary ? snapshot?.selectedFrame ?? null : detailQuery.data ?? null

  if (snapshotQuery.isLoading) {
    return <div className="rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-8 text-sm text-slate-300">Loading HallOGrid...</div>
  }

  if (snapshotQuery.error || !snapshot) {
    return <div className="rounded-[28px] border border-rose-400/20 bg-rose-400/10 px-6 py-8 text-sm text-rose-100">{snapshotQuery.error instanceof Error ? snapshotQuery.error.message : 'Failed to load HallOGrid.'}</div>
  }

  const activeColor = frame ? A[frame.action] : P.accent

  return (
    <div style={{ background: P.bg0, color: P.t1, minHeight: '100vh', fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');:root{--m:'JetBrains Mono',monospace;}@keyframes hallogrid-breathe{0%,100%{transform:translate(0,0) scale(1);opacity:.5;}50%{transform:translate(-2%,1.5%) scale(1.04);opacity:.75;}}@keyframes hallogrid-pulse{0%,100%{opacity:.35;transform:scale(1);}50%{opacity:0;transform:scale(2.5);}}@keyframes hallogrid-pulse-soft{0%,100%{opacity:1;}50%{opacity:.65;}}@keyframes hallogrid-beacon-fast{0%,100%{opacity:.15;transform:scale(.85);}50%{opacity:1;transform:scale(1.2);}}@keyframes hallogrid-beacon-slow{0%,100%{opacity:.2;transform:scale(.9);}50%{opacity:.75;transform:scale(1.08);}}@keyframes hallogrid-inspector-in{from{opacity:0;transform:translateX(28px);}to{opacity:1;transform:translateX(0);}}@keyframes hallogrid-sheet-up{from{transform:translateY(100%);}to{transform:translateY(0);}}::-webkit-scrollbar{width:3px;height:3px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:${P.borderLit};border-radius:2px;}button{font-family:inherit;}button:focus-visible{outline:2px solid ${P.accent};outline-offset:2px;}`}</style>
      <BackgroundGrid active={Boolean(sel)} color={activeColor} />
      <HeaderBar title={snapshot.title} subtitle={snapshot.subtitle} streamHealthy={snapshot.transport.streamHealthy} generatedAt={snapshot.generatedAt} />
      <TelemetryStrip frames={snapshot.frames} />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingTop: SCENE_TOP, paddingBottom: 18, paddingLeft: mobile ? 12 : 18, paddingRight: mobile ? 12 : 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'stretch' }}>
          <GlobePanel nodes={snapshot.world.nodes} flows={snapshot.world.flows} selectedRegion={frame?.region ?? null} projectionLagSec={snapshot.projection.projectionLagSec} streamHealthy={snapshot.transport.streamHealthy} expanded={!mobile && !sel} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: mobile ? '1fr' : 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
              gap: 16,
              alignItems: 'start',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: `calc(100vh - ${SCENE_TOP + 18}px)`, transformStyle: 'preserve-3d' }}>
              <div style={{ padding: '0 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${P.border}`, paddingBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: 'var(--m)', fontSize: 10, color: P.t3, letterSpacing: '0.12em' }}>DECISION FEED</div>
                  <div style={{ marginTop: 6, fontSize: 13, color: P.t1 }}>Select a frame. The governed record opens instantly with trace, replay, and proof.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--m)', fontSize: 10, color: P.t3 }}>{snapshot.frames.length} FRAMES</span>
                  <span style={{ fontFamily: 'var(--m)', fontSize: 10, color: A.run_now, letterSpacing: '0.1em', fontWeight: 700 }}>LIVE</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {snapshot.frames.map((item) => (
                  <FeedCard key={item.id} f={item} active={sel === item.id} anyActive={Boolean(sel)} onTap={(id) => setSel((current) => { const next = current === id ? null : id; if (next) setPanel('trace'); return next })} />
                ))}
              </div>
            </div>

            {!mobile && frame ? (
              <div style={{ minHeight: `calc(100vh - ${SCENE_TOP + 18}px)`, borderLeft: `1px solid ${P.border}`, boxShadow: `-12px 0 40px ${hex('#000000', 0.35)}`, animation: 'hallogrid-inspector-in 0.35s cubic-bezier(0.16,1,0.3,1)', overflow: 'hidden', borderRadius: 24 }}>
                <Inspector f={frame} detail={detail} panel={panel} setPanel={setPanel} close={() => setSel(null)} mobile={false} loading={Boolean(frame) && !detail && detailQuery.isLoading} />
              </div>
            ) : !mobile ? (
              <div style={{ minHeight: `calc(100vh - ${SCENE_TOP + 18}px)`, padding: '24px', borderRadius: 24, border: `1px solid ${P.border}`, background: `linear-gradient(180deg, ${P.glass2} 0%, ${P.glass} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: P.t2 }}>
                <div>
                  <div style={{ fontFamily: 'var(--m)', fontSize: 11, letterSpacing: '0.12em', color: '#dbeafe' }}>SELECT A FRAME</div>
                  <div style={{ marginTop: 10, fontSize: 14, lineHeight: 1.7 }}>The governed record will lock on the right with direct trace, replay, and proof sections.</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {mobile && frame ? (
        <div onClick={(event) => { if (event.target === event.currentTarget) setSel(null) }} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ borderRadius: '18px 18px 0 0', maxHeight: '90vh', overflow: 'hidden', animation: 'hallogrid-sheet-up 0.3s cubic-bezier(0.16,1,0.3,1)', boxShadow: `0 -12px 50px ${hex('#000000', 0.6)}` }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px', background: `${P.bg1}f8` }}><div style={{ width: 40, height: 4, borderRadius: 2, background: P.borderLit }} /></div>
            <Inspector f={frame} detail={detail} panel={panel} setPanel={setPanel} close={() => setSel(null)} mobile loading={Boolean(frame) && !detail && detailQuery.isLoading} />
          </div>
        </div>
      ) : null}
    </div>
  )
}



















