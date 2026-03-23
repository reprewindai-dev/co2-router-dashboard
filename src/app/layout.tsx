import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { Providers } from './providers'
import { CO2RouterLogo } from '@/components/CO2RouterLogo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CO2 Router - Carbon-Aware Compute Operations Console',
  description: 'Real-time carbon routing, decision engine status, and workload optimization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-slate-950">
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CO2RouterLogo size="md" />
                    <p className="text-xs text-slate-400">Carbon-Aware Compute Operations</p>
                  </div>
                  <nav className="flex items-center space-x-4">
                    <Link href="/console" className="text-sm text-slate-300 transition hover:text-white">
                      Console
                    </Link>
                    <Link href="/methodology" className="text-sm text-slate-500 transition hover:text-slate-300">
                      Methodology
                    </Link>
                  </nav>
                </div>
              </div>
            </header>

            <main className="container mx-auto px-6 py-8">{children}</main>

            <footer className="mt-16 border-t border-slate-800 bg-slate-900/50">
              <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <p>(c) 2026 CO2 Router. Carbon-aware compute for a sustainable future.</p>
                  <p>Signal layer: WattTime · EIA-930 · GridStatus · Ember</p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
