import type { Metadata } from 'next'
import Link from 'next/link'
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google'

import './globals.css'
import { BrandLogo } from '@/components/BrandLogo'
import { Providers } from './providers'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'CO2 Router | Deterministic Environmental Authorization Control Plane',
  description:
    'Control compute before it runs. CO2 Router evaluates workloads before execution, returns one binding action, and persists proof and replay lineage.',
}

const navGroups = [
  {
    label: 'Product',
    items: [
      { href: '/', label: 'Overview', description: 'Control-plane category overview and live product proof.' },
      { href: '/#how-it-works', label: 'How it works', description: 'Decision flow, doctrine, proof, and enforcement path.' },
      { href: '/control-surface', label: 'Control Surface', description: 'Live decision theater, proof, and replay visualization.' },
      { href: '/#decision-types', label: 'Decision Types', description: 'Run now, reroute, delay, throttle, or deny.' },
      { href: '/#integration-surfaces', label: 'Integrations', description: 'API, CI, Lambda, Kubernetes, queues, and webhooks.' },
      { href: '/#proof-replay', label: 'Proof & Replay', description: 'Canonical decision frames, replay, and audit lineage.' },
    ],
  },
  {
    label: 'Solutions',
    items: [
      { href: '/solutions#ci-cd', label: 'CI/CD', description: 'Put decision authority in front of builds and deploys.' },
      { href: '/solutions#serverless', label: 'Serverless', description: 'Support Lambda as an adapter, not as the architecture.' },
      { href: '/solutions#kubernetes', label: 'Kubernetes', description: 'Admission, region hinting, and enforcement artifacts.' },
      { href: '/solutions#batch-queues', label: 'Batch & Queues', description: 'Delay, reroute, or deny queued workloads before dispatch.' },
      { href: '/solutions#enterprise-governance', label: 'Enterprise Governance', description: 'Policy, proof, and operational control for regulated teams.' },
    ],
  },
  {
    label: 'Developers',
    items: [
      { href: '/developers#api-reference', label: 'API Reference', description: 'Canonical Decision API v1 request and response shape.' },
      { href: '/developers#adapters', label: 'Adapters', description: 'Thin runtime connectors around one deterministic core.' },
      { href: '/developers#schemas', label: 'Schemas', description: 'Decision, proof, telemetry, and assurance envelope examples.' },
      { href: '/developers#webhooks', label: 'Webhooks', description: 'Signed outbound events and replay-friendly payloads.' },
      { href: '/developers#quickstart', label: 'Quickstart', description: 'Minimal request path to get live decisions flowing.' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { href: '/architecture', label: 'Architecture', description: 'Control plane, adapter plane, proof model, and wedges.' },
      { href: '/methodology', label: 'Methodology', description: 'Deterministic doctrine, MSS, signal defensibility, and water guardrails.' },
      { href: '/pricing', label: 'Pricing', description: 'Commercial packaging for decisioning, proof, and governance depth.' },
      { href: '/faq', label: 'FAQ', description: 'Direct answers on what the product is and what is still open.' },
      { href: '/status-assurance', label: 'Status / Assurance', description: 'Operational truth, assurance posture, and live readiness.' },
    ],
  },
  {
    label: 'Company',
    items: [
      { href: '/contact', label: 'Contact', description: 'Commercial, pilot, and support contact paths.' },
      { href: '/access', label: 'Access / Demo', description: 'Request a pilot and see the control plane in your stack.' },
    ],
  },
] as const

const featuredLinks = [
  { href: '/control-surface', label: 'Control Surface' },
  { href: '/developers#quickstart', label: 'Quickstart' },
  { href: '/status-assurance', label: 'Status / Assurance' },
  { href: '/pricing', label: 'Pricing' },
]

const legalNav = [
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/acceptable-use', label: 'Acceptable Use' },
  { href: '/refund-policy', label: 'Refund Policy' },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,#18314a_0%,#0a1119_38%,#06090d_100%)] text-slate-100 antialiased">
        <Providers>
          <div className="relative min-h-screen overflow-x-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(138,190,255,0.10),transparent_24%,transparent_76%,rgba(127,255,212,0.08))]" />
            <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex min-w-0 items-center gap-3">
                  <BrandLogo variant="full" className="h-12 w-auto shrink-0 drop-shadow-[0_0_28px_rgba(109,225,255,0.2)]" />
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-[0.38em] text-slate-400">Decision authority before execution</div>
                    <div className="truncate text-base font-semibold text-white">Environmental authorization control plane</div>
                  </div>
                </Link>

                <nav className="hidden items-center gap-2 xl:flex">
                  {navGroups.map((group) => (
                    <div key={group.label} className="group relative">
                      <button className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
                        {group.label}
                      </button>
                      <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 mt-4 w-[420px] -translate-x-1/2 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-4 shadow-[0_35px_120px_rgba(2,6,23,0.7)] backdrop-blur-xl">
                          <div className="mb-3 px-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">{group.label}</div>
                          <div className="grid gap-2">
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-2xl border border-transparent px-4 py-3 transition hover:border-white/10 hover:bg-white/5"
                              >
                                <div className="text-sm font-semibold text-white">{item.label}</div>
                                <div className="mt-1 text-sm leading-6 text-slate-400">{item.description}</div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </nav>

                <div className="hidden items-center gap-3 md:flex xl:hidden">
                  {featuredLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <Link
                  href="/access"
                  className="hidden rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 sm:inline-flex"
                >
                  Request Access
                </Link>
              </div>

              <div className="border-t border-white/5 xl:hidden">
                <div className="mx-auto max-w-7xl px-5 py-3 sm:px-6 lg:px-8">
                  <details className="group rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                    <summary className="cursor-pointer list-none text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
                      Browse sections
                    </summary>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {navGroups.map((group) => (
                        <div key={group.label} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                          <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">{group.label}</div>
                          <div className="mt-3 grid gap-2">
                            {group.items.map((item) => (
                              <Link key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            </header>

            <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">{children}</main>

            <footer className="border-t border-white/10 bg-slate-950/85">
              <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
                  <div className="space-y-4">
                    <BrandLogo variant="full" className="h-16 w-auto drop-shadow-[0_0_30px_rgba(109,225,255,0.2)]" />
                    <p className="font-semibold uppercase tracking-[0.24em] text-slate-300">Decision authority before execution</p>
                    <p className="max-w-2xl leading-7 text-slate-400">
                      CO2 Router decides whether compute is allowed to run, where it should run, and under what environmental conditions, before execution happens. It is infrastructure governance software, not a reporting dashboard.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/architecture" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:text-white">
                        View architecture
                      </Link>
                      <Link href="/status-assurance" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:text-white">
                        Status / Assurance
                      </Link>
                    </div>
                  </div>

                  {navGroups.slice(0, 3).map((group) => (
                    <div key={group.label} className="space-y-3">
                      <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">{group.label}</div>
                      <div className="grid gap-2 text-sm text-slate-400">
                        {group.items.map((item) => (
                          <Link key={item.href} href={item.href} className="transition hover:text-white">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 md:grid-cols-2 xl:grid-cols-5">
                  {navGroups.map((group) => (
                    <div key={group.label} className="space-y-3">
                      <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">{group.label}</div>
                      <div className="grid gap-2 text-sm text-slate-400">
                        {group.items.map((item) => (
                          <Link key={item.href} href={item.href} className="transition hover:text-white">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
                    {legalNav.map((item) => (
                      <Link key={item.href} href={item.href} className="transition hover:text-white">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="text-sm text-slate-500">Production-grade deterministic decisioning and proof. Assurance closure still in progress.</div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
