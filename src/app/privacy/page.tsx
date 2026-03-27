import { LegalDocument } from '@/components/LegalDocument'

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      summary="This policy describes how operational metadata, decision traces, and support interactions are handled within the CO₂ Router surface."
      sections={[
        {
          heading: 'Operational metadata',
          body: [
            'The service may process preferred regions, workload criticality, scheduler hints, and related routing metadata required to authorize execution and generate proof.',
          ],
        },
        {
          heading: 'Proof records',
          body: [
            'Decision records, hashes, lineage, and evidence references may be retained to support replay, product operation, customer support, and compliance workflows.',
          ],
        },
        {
          heading: 'Access control',
          body: [
            'Internal replay and certain proof endpoints require internal service credentials. Access is limited to authorized personnel and properly configured integrations.',
          ],
        },
      ]}
    />
  )
}
