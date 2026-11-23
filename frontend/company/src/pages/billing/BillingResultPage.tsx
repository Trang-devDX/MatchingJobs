import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { buttonClass } from '@shared/ui/buttonStyles'
import { PageHeader } from '@shared/ui/PageHeader'
import { ROUTES } from '@/constants/routes'
import { usePaymentStatus } from '@/hooks/useBilling'
import { PAYMENT_EXPIRED, PAYMENT_FAILED, PAYMENT_PAID } from '@/services/billing.service'

const POLL_TIMEOUT_MS = 30_000

export function BillingResultPage() {
  const [params] = useSearchParams()
  const paymentId = params.get('payment_id')
  const [startedAt] = useState(() => Date.now())
  const [timedOut, setTimedOut] = useState(false)
  const payment = usePaymentStatus(paymentId, startedAt)
  const queryClient = useQueryClient()

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), POLL_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [paymentId])

  useEffect(() => {
    if (payment.data?.status === PAYMENT_PAID) {
      void queryClient.invalidateQueries({ queryKey: ['billing'] })
    }
  }, [payment.data?.status, queryClient])

  const status = payment.data?.status
  const paid = status === PAYMENT_PAID
  const failed = status === PAYMENT_FAILED || status === PAYMENT_EXPIRED
  const waiting = Boolean(paymentId) && !paid && !failed && !payment.isError && !payment.isLoading

  return (
    <section>
      <PageHeader
        eyebrow="BILLING"
        title="Payment result"
        description="Credits are added only after Stripe confirms the payment."
      />
      {!paymentId ? (
        <Alert>This payment link is missing a payment id.</Alert>
      ) : null}
      {payment.isLoading ? <p role="status" className="text-muted">Checking payment status…</p> : null}
      {payment.isError ? (
        <Alert>
          {errorMessage(payment.error, 'Could not load this payment.')}{' '}
          <Button variant="ghost" onClick={() => void payment.refetch()}>Retry</Button>
        </Alert>
      ) : null}
      {paid ? (
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <p className="font-semibold text-navy">Payment received.</p>
          <p className="mt-2 text-muted">You have {payment.data?.job_posting_credits ?? 0} job posting credits.</p>
        </div>
      ) : null}
      {failed ? (
        <Alert>
          {status === PAYMENT_EXPIRED
            ? 'This payment expired. No credits were added.'
            : 'This payment did not complete. No credits were added.'}
        </Alert>
      ) : null}
      {waiting ? (
        <p role="status" className="text-muted">
          {timedOut
            ? 'Payment is processing. Credits appear after Stripe confirms the payment.'
            : 'Waiting for Stripe to confirm this payment…'}
        </p>
      ) : null}
      <Link to={ROUTES.BILLING} className={buttonClass('secondary', 'mt-6 inline-flex')}>Back to billing</Link>
    </section>
  )
}
