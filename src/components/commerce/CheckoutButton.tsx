'use client'

import { useState, startTransition } from 'react'

import { ecobeApi } from '@/lib/api'
import type { BillingLane, BillingSegment } from '@/types'

interface CheckoutButtonProps {
  lane: BillingLane
  segment?: BillingSegment | null
  label: string
  className?: string
}

export function CheckoutButton({
  lane,
  segment = null,
  label,
  className,
}: CheckoutButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setError(null)
    setIsSubmitting(true)

    try {
      const session = await ecobeApi.createCheckoutSession({
        lane,
        segment,
      })

      const redirectUrl = session.url

      if (!redirectUrl) {
        throw new Error('Stripe checkout did not return a redirect URL.')
      }

      startTransition(() => {
        window.location.assign(redirectUrl)
      })
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : 'Unable to start checkout right now.'
      )
      setIsSubmitting(false)
      return
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isSubmitting}
        className={className}
      >
        {isSubmitting ? 'Redirecting...' : label}
      </button>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  )
}
