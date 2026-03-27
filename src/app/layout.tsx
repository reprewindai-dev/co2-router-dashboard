import type { Metadata } from 'next'
import Link from 'next/link'
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google'

import './globals.css'
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
    'Pre-execution environmental authorization for compute with five binding actions, proof lineage, replay, and enterprise enforcement surfaces.',
}

const primaryNav = [
  { href: '/', label: 'Overview' },
  { href: '/positioning', label: 'Positioning' },
  { href: '/control-surface', label: 'Control Surface' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
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
                <Link href="/" className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 shadow-[0_0_40px_rgba(16,185,129,0.18)]">
                    <span className="font-mono text-lg font-semibold text-emerald-200">CO2</span>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.38em] text-slate-400">ECOBE / CO2 Router</div>
                    <div className="text-base font-semibold text-white">Environmental Authorization Control Plane</div>
                  </div>
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                  {primaryNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm text-slate-300 transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </header>

            <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">{children}</main>

            <footer className="border-t border-white/10 bg-slate-950/85">
              <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 text-sm text-slate-400 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
                <div className="space-y-3">
                  <p className="font-semibold uppercase tracking-[0.24em] text-slate-300">Decision authority before execution</p>
                  <p className="max-w-2xl leading-6 text-slate-400">
                    CO2 Router decides whether compute is allowed to run, where it should run, and under what environmental conditions, before execution happens.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 lg:justify-end">
                  {legalNav.map((item) => (
                    <Link key={item.href} href={item.href} className="transition hover:text-white">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
