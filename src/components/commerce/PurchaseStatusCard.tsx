'use client'

import { useEffect, useState } from 'react'

import { ecobeApi } from '@/lib/api'
import type { CommerceCheckoutSessionStatusResponse } from '@/types'

export function PurchaseStatusCard({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<CommerceCheckoutSessionStatusResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    ecobeApi
      .getCheckoutSessionStatus(sessionId)
      .then((response) => {
        if (!cancelled) {
          setStatus(response)
        }
      })
      .catch((sessionError) => {
        if (!cancelled) {
          setError(
            sessionError instanceof Error
              ? sessionError.message
              : 'Unable to confirm purchase status.'
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [sessionId])

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-5 text-sm text-rose-100">
        {error}
      </div>
    )
  }

  if (!status) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">
        Confirming live checkout status...
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-emerald-300/18 bg-emerald-300/[0.08] p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-emerald-100">Purchase status</div>
      <h2 className="mt-3 text-2xl font-bold text-white">
        {status.priceLabel ?? 'Checkout confirmed'}
      </h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Checkout</div>
          <div className="mt-2 text-lg font-semibold text-white">{status.checkoutStatus ?? 'unknown'}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Payment</div>
          <div className="mt-2 text-lg font-semibold text-white">{status.paymentStatus ?? 'unknown'}</div>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm leading-7 text-slate-100">
        <p>Activation is tied to the billing email captured in Stripe. The system sends the API key and control-surface guidance there.</p>
        {status.organization ? (
          <p>
            Active organization: <span className="font-semibold text-white">{status.organization.name}</span> ({status.organization.slug})
          </p>
        ) : null}
        {status.organization?.accessExpiresAt ? (
          <p>Temporary access expires at {new Date(status.organization.accessExpiresAt).toLocaleString()}.</p>
        ) : null}
      </div>
    </div>
  )
}
