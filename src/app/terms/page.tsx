import { LegalDocument } from '@/components/LegalDocument'

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      summary="These terms govern access to the CO₂ Router control surface, runtime authorization APIs, proof exports, and enforcement artifacts."
      sections={[
        {
          heading: 'Service scope',
          body: [
            'CO₂ Router provides deterministic pre-execution decisioning, evidence views, and integration artifacts. It does not guarantee that downstream execution systems will enforce a decision unless the customer has correctly integrated the supplied CI/CD or Kubernetes contracts.',
          ],
        },
        {
          heading: 'Customer responsibilities',
          body: [
            'Customers must secure their credentials, maintain correct downstream enforcement hooks, and validate that their own workload metadata is accurate before invoking runtime authorization.',
          ],
        },
        {
          heading: 'Evidence and replay',
          body: [
            'Proof and replay outputs are bounded by source availability, configured provider access, and the active assurance posture disclosed by the service at decision time.',
          ],
        },
      ]}
    />
  )
}
