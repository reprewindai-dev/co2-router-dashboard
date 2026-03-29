import { InformationPageShell } from '@/components/site/InformationPageShell'

export default function DevelopersSdksPage() {
  return (
    <InformationPageShell
      eyebrow="Developers / SDKs"
      title="The current integration surface is the contract, not a marketing SDK claim."
      summary="CO2 Router does not currently publish a separate SDK line. The real surface is the canonical HTTP contract, the adapter plane, and the enforcement bundles emitted by the engine."
      secondaryHref="/developers/adapters"
      secondaryLabel="View Adapters"
    >
      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: 'What is real',
            body: 'The HTTP decision contract, replay routes, provenance inspection, and runtime adapters already exist and are the supported integration surface today.',
          },
          {
            title: 'What is not claimed',
            body: 'No separate public npm package, language SDK suite, or generated client library is advertised here because those surfaces are not the product contract yet.',
          },
          {
            title: 'How to integrate now',
            body: 'Call the authorization endpoint directly, use the adapter IDs where applicable, and consume proof, replay, and provenance records from the control plane.',
          },
        ].map((card) => (
          <article key={card.title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold text-white">{card.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{card.body}</p>
          </article>
        ))}
      </section>
    </InformationPageShell>
  )
}
