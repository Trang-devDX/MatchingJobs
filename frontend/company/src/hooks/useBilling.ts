import { useMutation, useQuery } from '@tanstack/react-query'
import { BillingService, PAYMENT_EXPIRED, PAYMENT_FAILED, PAYMENT_PAID } from '@/services/billing.service'

const POLL_MS = 2_000
const POLL_TIMEOUT_MS = 30_000

export function useBilling() {
  return useQuery({
    queryKey: ['billing'],
    queryFn: ({ signal }) => BillingService.summary(signal),
  })
}

export function useCheckout() {
  return useMutation({
    mutationFn: () => BillingService.checkout(),
    onSuccess: (session) => {
      window.location.assign(session.checkout_url)
    },
  })
}

export function usePaymentStatus(paymentId: string | null, startedAt: number) {
  return useQuery({
    queryKey: ['billing', 'payment', paymentId],
    queryFn: ({ signal }) => BillingService.payment(paymentId as string, signal),
    enabled: Boolean(paymentId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === PAYMENT_PAID || status === PAYMENT_FAILED || status === PAYMENT_EXPIRED) return false
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) return false
      return POLL_MS
    },
  })
}
