export default function ContactPage() {
  return (
    <div className="space-y-8 pb-10">
      <section className="surface-card-strong p-8">
        <div className="eyebrow">Contact</div>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Reach the operator team behind the control plane.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          Use this channel for enterprise pilots, governance reviews, or proof and enforcement integration questions.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <div className="eyebrow">Commercial</div>
          <div className="mt-4 text-lg font-semibold text-white">operators@co2router.com</div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Pricing, pilots, and commercial review for platform teams and enterprise governance buyers.
          </p>
        </div>

        <div className="surface-card p-6">
          <div className="eyebrow">Support</div>
          <div className="mt-4 text-lg font-semibold text-white">support@co2router.com</div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Runtime incidents, replay issues, and integration support for CI/CD, Kubernetes, and external decision consumers.
          </p>
        </div>
      </section>
    </div>
  )
}
