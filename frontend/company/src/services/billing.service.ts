import { api } from './api'

export const PAYMENT_PENDING = 1
export const PAYMENT_PAID = 2
export const PAYMENT_EXPIRED = 3
export const PAYMENT_FAILED = 9

const STATUS_LABELS: Record<number, string> = {
  [PAYMENT_PENDING]: 'Pending',
  [PAYMENT_PAID]: 'Paid',
  [PAYMENT_EXPIRED]: 'Expired',
  [PAYMENT_FAILED]: 'Failed',
}

export type Payment = {
  id: string
  amount: number | null
  currency: string
  credits: number
  status: number
  paid_at: string | null
  created_at: string | null
  job_posting_credits?: number
}

export type Billing = {
  job_posting_credits: number
  can_purchase: boolean
  payments: Payment[]
}

export type CheckoutSession = {
  payment_id: string
  checkout_url: string
}

export function paymentStatusLabel(status: number) {
  return STATUS_LABELS[status] ?? 'Unknown'
}

export function formatMoney(amount: number | null, currency: string) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amount / 100)
}

export const BillingService = {
  async summary(signal?: AbortSignal) {
    const result = await api.request<Billing>('/company/billing', { signal })
    return result.data
  },

  async checkout() {
    const result = await api.request<CheckoutSession>('/company/billing/checkout', { method: 'POST' })
    return result.data
  },

  async payment(id: string, signal?: AbortSignal) {
    const result = await api.request<Payment>(`/company/billing/payments/${id}`, { signal })
    return result.data
  },
}
