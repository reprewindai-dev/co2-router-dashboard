import type { Metadata } from 'next'

export const siteUrl = 'https://co2router.com'
export const siteTechUrl = 'https://co2router.tech'
export const siteName = 'CO2 Router'
export const siteTitle = 'Carbon-Aware Compute Routing and Environmental Execution Control Plane'
export const defaultDescription =
  'CO2 Router is a carbon-aware compute routing and environmental execution control plane that authorizes workloads before execution using carbon, water, latency, cost, and policy constraints, then attaches proof, trace, replay, and provenance to every decision.'
export const defaultOgImage = '/co2router-poster.svg'
export const brandAliases = [
  'CO2Router',
  'CO2 Router Console',
  'CO2 Router Control Surface',
  'CO2 Router Platform',
  'CO2Router.tech',
] as const
export const globalSeoKeywords = [
  'CO2 Router',
  'CO2Router',
  'CO2 Router console',
  'CO2 Router control surface',
  'carbon-aware compute routing',
  'carbon aware workload routing',
  'environmental execution control plane',
  'carbon-aware CI routing',
  'water-aware workload orchestration',
  'deterministic workload authorization',
  'pre-execution compute control',
  'compute routing software',
  'carbon routing software',
  'sustainable infrastructure control plane',
  'trace replay provenance for compute',
] as const

export const coreSitePaths = [
  '/',
  '/design-partners',
  '/design-partners/one-pager',
  '/console',
  '/assurance',
  '/status',
  '/methodology',
  '/blog',
  '/developers/api',
  '/developers/adapters',
  '/developers/architecture',
  '/developers/quickstart',
  '/system/decision-engine',
  '/system/saiq-governance',
  '/system/trace-ledger',
  '/system/replay',
  '/system/provenance',
  '/company/about',
  '/company/security',
  '/company/roadmap',
] as const

type PageMetadataOptions = {
  title: string
  description: string
  path: string
  keywords?: string[]
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: PageMetadataOptions): Metadata {
  const url = path === '/' ? siteUrl : `${siteUrl}${path}`
  const mergedKeywords = Array.from(new Set([...globalSeoKeywords, ...keywords]))

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: path,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'website',
      siteName,
      title,
      description,
      url,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: 'CO2 Router control surface poster',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [defaultOgImage],
    },
    other: {
      'application-name': siteName,
      'apple-mobile-web-app-title': siteName,
    },
  }
}
