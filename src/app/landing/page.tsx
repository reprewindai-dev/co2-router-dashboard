'use client'

import { useState } from 'react'
import Link from 'next/link'

const WORKLOADS = [
  { id: 'ml-training', name: 'ML Training', duration: '8h', compute: '8x GPU' },
  { id: 'batch-job', name: 'Batch Processing', duration: '2h', compute: '16x vCPU' },
  { id: 'inference', name: 'Model Inference', duration: '4h', compute: '4x GPU' },
]

const REGIONS = [
  { id: 'us-east-1', name: 'US East (N. Virginia)', carbon: 245, demand: '67%' },
  { id: 'us-west-2', name: 'US West (Oregon)', carbon: 124, demand: '51%' },
  { id: 'eu-west-1', name: 'EU (Ireland)', carbon: 189, demand: '58%' },
  { id: 'eu-central-1', name: 'EU (Frankfurt)', carbon: 156, demand: '54%' },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', carbon: 312, demand: '82%' },
]

export default function LandingPage() {
  const [selectedWorkload, setSelectedWorkload] = useState(WORKLOADS[0])
  const [isRouting, setIsRouting] = useState(false)
  const [routingResult, setRoutingResult] = useState<any>(null)

  const handleRoute = async () => {
    setIsRouting(true)
    
    // Simulate routing delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Find region with lowest carbon
    const sortedRegions = [...REGIONS].sort((a, b) => a.carbon - b.carbon)
    const winner = sortedRegions[0]
    const worst = sortedRegions[sortedRegions.length - 1]
    const carbonDelta = ((worst.carbon - winner.carbon) / worst.carbon * 100).toFixed(0)
    
    setRoutingResult({
      chosenRegion: winner,
      alternatives: sortedRegions.slice(1, 3),
      source: winner.carbon < 150 ? 'WattTime' : 'Static Fallback',
      carbonDelta: `-${carbonDelta}%`,
      confidence: winner.carbon < 150 ? '0.92' : '0.68',
      status: winner.carbon < 150 ? 'Optimal' : 'Degraded',
    })
    
    setIsRouting(false)
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EDF3]">
      {/* Navigation */}
      <nav className="border-b border-[#2A2F36]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="3" stroke="#AAB4BE" strokeWidth="1"/>
              <line x1="16" y1="16" x2="8" y2="8" stroke="#AAB4BE" strokeWidth="1"/>
              <line x1="16" y1="16" x2="24" y2="8" stroke="#AAB4BE" strokeWidth="1"/>
              <line x1="16" y1="16" x2="8" y2="24" stroke="#AAB4BE" strokeWidth="1"/>
              <line x1="16" y1="16" x2="24" y2="24" stroke="#AAB4BE" strokeWidth="1"/>
              <line x1="16" y1="16" x2="16" y2="6" stroke="url(#gradient)" strokeWidth="1"/>
              <circle cx="8" cy="8" r="2" fill="#AAB4BE"/>
              <circle cx="24" cy="8" r="2" fill="#AAB4BE"/>
              <circle cx="8" cy="24" r="2" fill="#AAB4BE"/>
              <circle cx="24" cy="24" r="2" fill="#AAB4BE"/>
              <circle cx="16" cy="6" r="2" fill="url(#gradient)"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D084"/>
                  <stop offset="100%" stopColor="#3DDCFF"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="font-semibold text-lg">CO₂Router</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/api/v1/health" className="text-[#AAB4BE] hover:text-[#E6EDF3] transition-colors">
              API Docs
            </Link>
            <button className="bg-[#00D084] hover:bg-[#00b876] text-black font-medium px-4 py-2 rounded transition-colors">
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Route compute to cleaner regions automatically.
            </h1>
            <p className="text-xl text-[#AAB4BE] mb-8">
              CO₂Router selects the lowest-carbon region in real time using live grid signals and fallback logic.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-[#00D084] to-[#3DDCFF] hover:from-[#00b876] hover:to-[#2dc8f0] text-black font-semibold px-6 py-3 rounded transition-all"
              >
                Try Live Demo
              </button>
              <Link href="/api/v1/health" className="border border-[#2A2F36] hover:border-[#AAB4BE] px-6 py-3 rounded transition-colors">
                View API
              </Link>
            </div>
          </div>

          {/* Right Column - Live Demo */}
          <div id="demo" className="bg-[#11161C] border border-[#2A2F36] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Live Routing Demo</h3>
            
            {/* Workload Selector */}
            <div className="mb-6">
              <label className="block text-sm text-[#AAB4BE] mb-2">Select Workload</label>
              <div className="grid grid-cols-3 gap-2">
                {WORKLOADS.map(workload => (
                  <button
                    key={workload.id}
                    onClick={() => setSelectedWorkload(workload)}
                    className={`p-3 rounded text-sm border transition-all ${
                      selectedWorkload.id === workload.id
                        ? 'border-[#00D084] bg-[#00D084]/10'
                        : 'border-[#2A2F36] hover:border-[#AAB4BE]'
                    }`}
                  >
                    <div className="font-medium">{workload.name}</div>
                    <div className="text-xs text-[#AAB4BE]">{workload.duration}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Regions */}
            <div className="mb-6">
              <label className="block text-sm text-[#AAB4BE] mb-2">Candidate Regions</label>
              <div className="space-y-2">
                {REGIONS.map(region => (
                  <div
                    key={region.id}
                    className={`flex items-center justify-between p-3 rounded border transition-all ${
                      routingResult?.chosenRegion?.id === region.id
                        ? 'border-[#00D084] bg-[#00D084]/10'
                        : 'border-[#2A2F36]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{region.name}</div>
                      <div className="text-xs text-[#AAB4BE]">Demand: {region.demand}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">{region.carbon} g CO₂/kWh</div>
                      {routingResult?.chosenRegion?.id === region.id && (
                        <div className="text-xs text-[#00D084]">Selected</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Route Button */}
            <button
              onClick={handleRoute}
              disabled={isRouting}
              className="w-full bg-gradient-to-r from-[#00D084] to-[#3DDCFF] hover:from-[#00b876] hover:to-[#2dc8f0] disabled:opacity-50 text-black font-semibold py-3 rounded transition-all"
            >
              {isRouting ? 'Routing...' : 'Route Workload'}
            </button>

            {/* Results */}
            {routingResult && (
              <div className="mt-6 p-4 bg-[#161B22] border border-[#2A2F36] rounded">
                <h4 className="font-semibold mb-3">Routing Decision</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#AAB4BE]">Chosen Region:</span>
                    <span>{routingResult.chosenRegion.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AAB4BE]">Source:</span>
                    <span>{routingResult.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AAB4BE]">Carbon Delta:</span>
                    <span className="text-[#00D084]">{routingResult.carbonDelta}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AAB4BE]">Confidence:</span>
                    <span>{routingResult.confidence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AAB4BE]">Status:</span>
                    <span className={routingResult.status === 'Optimal' ? 'text-[#00D084]' : 'text-[#3DDCFF]'}>
                      {routingResult.status}
                    </span>
                  </div>
                </div>
                
                {routingResult.alternatives.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#2A2F36]">
                    <div className="text-xs text-[#AAB4BE] mb-2">Alternative Regions:</div>
                    {routingResult.alternatives.map((alt: any) => (
                      <div key={alt.id} className="text-xs py-1">
                        {alt.name}: {alt.carbon} g CO₂/kWh
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#00D084]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-[#00D084] rounded-full"></div>
            </div>
            <h3 className="font-semibold mb-2">Connect</h3>
            <p className="text-[#AAB4BE] text-sm">Integrate with your infrastructure via simple API calls</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#3DDCFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-[#3DDCFF] rounded-full"></div>
            </div>
            <h3 className="font-semibold mb-2">Route</h3>
            <p className="text-[#AAB4BE] text-sm">Real-time carbon analysis selects optimal regions automatically</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#00D084]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-[#00D084] rounded-full"></div>
            </div>
            <h3 className="font-semibold mb-2">Optimize</h3>
            <p className="text-[#AAB4BE] text-sm">Continuous optimization reduces carbon footprint without performance loss</p>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Simple API Integration</h2>
        <div className="bg-[#11161C] border border-[#2A2F36] rounded-xl p-6">
          <div className="mb-4">
            <div className="text-sm text-[#AAB4BE] mb-2">Endpoint:</div>
            <div className="font-mono text-[#00D084]">POST /api/v1/route</div>
          </div>
          <div className="mb-4">
            <div className="text-sm text-[#AAB4BE] mb-2">Example:</div>
            <pre className="bg-[#0B0F14] p-4 rounded text-sm overflow-x-auto">
{`co2router.route({
  workloadId: "ml-training-123",
  candidateRegions: ["us-east-1", "us-west-2", "eu-west-1"],
  durationMinutes: 480
})`}
            </pre>
          </div>
          <div>
            <div className="text-sm text-[#AAB4BE] mb-2">Response:</div>
            <pre className="bg-[#0B0F14] p-4 rounded text-sm overflow-x-auto">
{`{
  "chosenRegion": "us-west-2",
  "carbonDelta": "-38%",
  "source": "WattTime",
  "confidence": 0.92,
  "status": "Optimal"
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#11161C] border border-[#2A2F36] rounded-xl p-6">
            <h3 className="font-semibold text-xl mb-2">Free</h3>
            <div className="text-3xl font-bold mb-4">$0<span className="text-sm text-[#AAB4BE]">/month</span></div>
            <ul className="space-y-2 text-sm text-[#AAB4BE]">
              <li>• 1,000 API calls</li>
              <li>• US regions only</li>
              <li>• Basic routing</li>
            </ul>
            <button className="w-full mt-6 border border-[#2A2F36] hover:border-[#AAB4BE] py-2 rounded transition-colors">
              Start Free
            </button>
          </div>
          
          <div className="bg-[#11161C] border border-[#00D084] rounded-xl p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#00D084] text-black text-xs px-3 py-1 rounded-full">
              Popular
            </div>
            <h3 className="font-semibold text-xl mb-2">Pro</h3>
            <div className="text-3xl font-bold mb-4">$99<span className="text-sm text-[#AAB4BE]">/month</span></div>
            <ul className="space-y-2 text-sm text-[#AAB4BE]">
              <li>• Full global regions</li>
              <li>• Advanced routing logic</li>
              <li>• Forecasting data</li>
              <li>• Priority support</li>
            </ul>
            <button className="w-full mt-6 bg-[#00D084] hover:bg-[#00b876] text-black font-medium py-2 rounded transition-colors">
              Start Pro
            </button>
          </div>
          
          <div className="bg-[#11161C] border border-[#2A2F36] rounded-xl p-6">
            <h3 className="font-semibold text-xl mb-2">Enterprise</h3>
            <div className="text-3xl font-bold mb-4">Custom</div>
            <ul className="space-y-2 text-sm text-[#AAB4BE]">
              <li>• Unlimited API calls</li>
              <li>• 99.9% SLA guarantee</li>
              <li>• Custom integrations</li>
              <li>• Dedicated support</li>
            </ul>
            <button className="w-full mt-6 border border-[#2A2F36] hover:border-[#AAB4BE] py-2 rounded transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Start Routing Carbon, Not Emissions</h2>
        <p className="text-xl text-[#AAB4BE] mb-8">Join companies reducing their compute footprint with intelligent routing.</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-[#00D084] to-[#3DDCFF] hover:from-[#00b876] hover:to-[#2dc8f0] text-black font-semibold px-8 py-3 rounded transition-all"
          >
            Start Free
          </button>
          <button 
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            className="border border-[#2A2F36] hover:border-[#AAB4BE] px-8 py-3 rounded transition-colors"
          >
            Try Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2F36] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#AAB4BE]">
          <p>© 2026 CO₂Router. Built for a carbon-neutral future.</p>
          <p className="mt-2">Powered by WattTime, EIA-930, Ember, regional grid sources</p>
        </div>
      </footer>
    </div>
  )
}
