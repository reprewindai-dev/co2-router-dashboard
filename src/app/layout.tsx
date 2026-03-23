import type { Metadata } from 'next'
import Link from 'next/link'
import { IBM_Plex_Sans, Space_Grotesk } from 'next/font/google'

import { CO2RouterLogo } from '@/components/CO2RouterLogo'

import './globals.css'
import { Providers } from './providers'

const bodyFont = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'CO2 Router - Carbon-Aware Compute Command Center',
  description:
    'Production command center for carbon-aware routing, assurance exports, forecast intelligence, and DEKES workload activation.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-slate-950 text-slate-50`}>
        <Providers>
          <div className="relative min-h-screen overflow-hidden bg-grid-mesh">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_48%)]" />
            <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="pointer-events-none absolute left-0 top-72 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

            <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
              <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-5 py-4 md:px-8">
                <div className="flex items-center gap-4">
                  <CO2RouterLogo size="md" />
                  <div className="hidden md:block">
                    <p className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300/80">
                      Carbon-Aware Compute
                    </p>
                    <p className="text-xs text-slate-400">
                      Routing, assurance exports, and live grid intelligence.
                    </p>
                  </div>
                </div>

                <nav className="flex items-center gap-3 text-sm">
                  <Link
                    href="/"
                    className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-slate-300 transition hover:border-slate-700 hover:text-white"
                  >
                    Overview
                  </Link>
                  <Link
                    href="/console"
                    className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-300 transition hover:bg-emerald-500/20"
                  >
                    Command Center
                  </Link>
                  <Link
                    href="/methodology"
                    className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-slate-300 transition hover:border-slate-700 hover:text-white"
                  >
                    Methodology
                  </Link>
                </nav>
              </div>
            </header>

            <main className="relative mx-auto w-full max-w-[1500px] px-5 py-8 md:px-8">{children}</main>

            <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur">
              <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-5 py-7 text-sm text-slate-400 md:flex-row md:items-center md:justify-between md:px-8">
                <p>© 2026 CO2 Router. Carbon-aware compute command infrastructure.</p>
                <p>Signal layer: WattTime · EIA-930 · GridStatus · Ember · ISO telemetry</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
