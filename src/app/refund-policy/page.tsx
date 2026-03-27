import { LegalDocument } from '@/components/LegalDocument'

export default function RefundPolicyPage() {
  return (
    <LegalDocument
      title="Refund Policy"
      summary="This policy describes refund handling for control-surface subscriptions and enterprise contracts."
      sections={[
        {
          heading: 'Monthly subscriptions',
          body: [
            'Monthly plans are billed in advance. Refunds are generally not issued for partial months already delivered unless a billing error is confirmed.',
          ],
        },
        {
          heading: 'Enterprise agreements',
          body: [
            'Enterprise deployments, pilot commitments, and professional integration work are governed by the commercial order form or master services agreement.',
          ],
        },
        {
          heading: 'Billing errors',
          body: [
            'If you believe a billing error occurred, contact support with the invoice reference and the operator team will review the charge.',
          ],
        },
      ]}
    />
  )
}
