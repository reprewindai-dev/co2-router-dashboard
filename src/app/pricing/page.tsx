const tiers = [
  {
    name: 'Operator',
    price: '$2,500/mo',
    description: 'Control-surface access, runtime authorization API, CI/CD bundle generation, and bounded replay visibility.',
  },
  {
    name: 'Governance',
    price: '$8,000/mo',
    description: 'Adds multi-team policy governance, enhanced proof export, and production enforcement posture for regulated workloads.',
  },
  {
    name: 'Assurance',
    price: 'Custom',
    description: 'For enterprises that need signed export chains, internal replay routing, and controlled audit evidence workflows.',
  },
]

export default function PricingPage() {
  return (
    <div className="space-y-8 pb-10">
      <section className="surface-card-strong p-8">
        <div className="eyebrow">Pricing</div>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Charge for control, enforcement, and proof.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          CO₂ Router is sold as execution approval infrastructure. The commercial surface is tied to decisioning, enforcement, proof, and governance depth, not to a generic sustainability dashboard seat count.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.name} className="surface-card p-6">
            <div className="eyebrow">{tier.name}</div>
            <div className="mt-4 text-3xl font-semibold text-white">{tier.price}</div>
            <p className="mt-4 text-sm leading-7 text-slate-300">{tier.description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
