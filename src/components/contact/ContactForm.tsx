'use client'

import { useState } from 'react'

import { CONTACT_CATEGORIES, type ContactCategory, validateContactSubmission } from '@/lib/contact'
import { ecobeApi } from '@/lib/api'

interface FormState {
  category: ContactCategory
  name: string
  email: string
  company: string
  message: string
  executionFootprint: string
  integrationSurface: string
  website: string
}

type SubmissionStatus =
  | { type: 'idle' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string; fieldErrors?: Record<string, string> }

const initialState: FormState = {
  category: 'sales',
  name: '',
  email: '',
  company: '',
  message: '',
  executionFootprint: '',
  integrationSurface: '',
  website: '',
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [status, setStatus] = useState<SubmissionStatus>({ type: 'idle' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus({ type: 'idle' })

    const validation = validateContactSubmission(form)
    if (validation.spam) {
      setStatus({
        type: 'success',
        message: 'Your message has been routed to the CO2 Router operating inbox.',
      })
      return
    }

    if (!validation.success) {
      setStatus({
        type: 'error',
        message: 'Contact submission failed validation.',
        fieldErrors: validation.errors,
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await ecobeApi.submitContact(form)
      setForm(initialState)
      setStatus({
        type: 'success',
        message: response.message,
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Contact submission failed. Please try again shortly.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldErrors = status.type === 'error' ? status.fieldErrors ?? {} : {}

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
            Category
          </span>
          <select
            value={form.category}
            onChange={(event) => updateField('category', event.target.value as ContactCategory)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
          >
            {CONTACT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          {fieldErrors.category ? (
            <p className="text-xs text-rose-300">{fieldErrors.category}</p>
          ) : null}
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
            Name
          </span>
          <input
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
            autoComplete="name"
          />
          {fieldErrors.name ? <p className="text-xs text-rose-300">{fieldErrors.name}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
            Email
          </span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
            autoComplete="email"
          />
          {fieldErrors.email ? <p className="text-xs text-rose-300">{fieldErrors.email}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
            Company
          </span>
          <input
            value={form.company}
            onChange={(event) => updateField('company', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
            autoComplete="organization"
          />
          {fieldErrors.company ? (
            <p className="text-xs text-rose-300">{fieldErrors.company}</p>
          ) : null}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
            Execution footprint
          </span>
          <input
            value={form.executionFootprint}
            onChange={(event) => updateField('executionFootprint', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
            placeholder="GPU training, batch queues, CI runners"
          />
          {fieldErrors.executionFootprint ? (
            <p className="text-xs text-rose-300">{fieldErrors.executionFootprint}</p>
          ) : null}
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
            Integration surface
          </span>
          <input
            value={form.integrationSurface}
            onChange={(event) => updateField('integrationSurface', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
            placeholder="HTTP, CI/CD, Kubernetes, queues"
          />
          {fieldErrors.integrationSurface ? (
            <p className="text-xs text-rose-300">{fieldErrors.integrationSurface}</p>
          ) : null}
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
          Message
        </span>
        <textarea
          value={form.message}
          onChange={(event) => updateField('message', event.target.value)}
          rows={7}
          className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
          placeholder="Describe the workloads you want CO2 Router to govern before execution."
        />
        {fieldErrors.message ? (
          <p className="text-xs text-rose-300">{fieldErrors.message}</p>
        ) : null}
      </label>

      <label className="hidden">
        <span>Website</span>
        <input
          value={form.website}
          onChange={(event) => updateField('website', event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      {status.type === 'success' ? (
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {status.message}
        </div>
      ) : null}

      {status.type === 'error' ? (
        <div className="rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {status.message}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs leading-relaxed text-slate-400">
          Messages route through the engine-backed intake path and the shared monitored inbox.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full border border-cyan-400/50 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Sending...' : 'Send request'}
        </button>
      </div>
    </form>
  )
}
