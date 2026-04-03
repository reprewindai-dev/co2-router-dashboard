import type { Metadata } from 'next'

import { CommandCenterShell } from '@/components/command-center/CommandCenterShell'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'CO2 Router Console',
  description:
    'CO2 Router Console, powered by HallOGrid, is the live environmental execution control surface for SAIQ governance, trace, replay, provenance, proof, and pre-execution workload authority.',
  path: '/console',
  keywords: [
    'CO2 Router control surface',
    'CO2 Router console',
    'HallOGrid',
    'HallOGrid console',
    'CO2Router console',
    'execution control plane',
    'carbon-aware compute routing software',
    'pre-execution workload authorization',
    'trace replay provenance',
    'SAIQ governance',
  ],
})

export default function ConsolePage() {
  return <CommandCenterShell />
}
