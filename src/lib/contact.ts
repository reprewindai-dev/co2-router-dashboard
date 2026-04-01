import type { ContactSubmissionInput } from '@/types'

export const CONTACT_CATEGORIES = ['sales', 'support', 'security'] as const

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number]

export interface ContactValidationResult {
  success: boolean
  errors?: Record<string, string>
  spam?: boolean
}

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function validateContactSubmission(input: ContactSubmissionInput): ContactValidationResult {
  const errors: Record<string, string> = {}

  const category = normalizeString(input.category).toLowerCase()
  const name = normalizeString(input.name)
  const email = normalizeString(input.email).toLowerCase()
  const company = normalizeString(input.company)
  const message = normalizeString(input.message)
  const executionFootprint = normalizeString(input.executionFootprint)
  const integrationSurface = normalizeString(input.integrationSurface)
  const website = normalizeString(input.website)

  if (website) {
    return { success: false, spam: true }
  }

  if (!CONTACT_CATEGORIES.includes(category as ContactCategory)) {
    errors.category = 'Choose sales, support, or security.'
  }

  if (name.length < 2 || name.length > 120) {
    errors.name = 'Enter a valid name.'
  }

  if (!isEmail(email) || email.length > 254) {
    errors.email = 'Enter a valid email address.'
  }

  if (company.length > 160) {
    errors.company = 'Company name is too long.'
  }

  if (message.length < 20 || message.length > 5000) {
    errors.message = 'Message must be between 20 and 5000 characters.'
  }

  if (executionFootprint.length > 300) {
    errors.executionFootprint = 'Execution footprint is too long.'
  }

  if (integrationSurface.length > 300) {
    errors.integrationSurface = 'Integration surface is too long.'
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  return { success: true }
}
