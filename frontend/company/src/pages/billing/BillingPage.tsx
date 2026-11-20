import { CreditCard } from 'lucide-react'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { PageHeader } from '@shared/ui/PageHeader'
import { useBilling, useCheckout } from '@/hooks/useBilling'
import { formatMoney, paymentStatusLabel } from '@/services/billing.service'
import { formatDate } from '@/services/job-listing.service'

export function BillingPage() {
  const billing = useBilling()
  const checkout = useCheckout()
  const payments = billing.data?.payments ?? []

  return (
    <section>
      <PageHeader
        eyebrow="BILLING"
        title="Job posting credits"
        description="One credit publishes one job listing. Drafts stay free."
      />
      {billing.isLoading ? <p role="status" className="text-muted">Loading billing…</p> : null}
      {billing.isError ? (
        <Alert>
          {errorMessage(billing.error, 'Could not load billing.')}{' '}
          <Button variant="ghost" onClick={() => void billing.refetch()}>Retry</Button>
        </Alert>
      ) : null}
      {checkout.isError ? (
        <Alert>{errorMessage(checkout.error, 'Could not start checkout.')}</Alert>
      ) : null}
      {billing.data ? (
        <>
          <div className="mb-6 rounded-2xl border border-line bg-white p-6 shadow-sm">
            <p className="text-sm text-muted">Available credits</p>
            <p className="mt-1 text-4xl font-bold text-navy">{billing.data.job_posting_credits}</p>
            {billing.data.can_purchase ? (
              <div className="mt-4">
                <Button disabled={checkout.isPending} onClick={() => checkout.mutate()}>
                  {checkout.isPending ? 'Redirecting to Stripe…' : 'Buy 1 job posting credit'}
                </Button>
                <p className="mt-2 text-sm text-muted">The price is charged on the Stripe checkout page.</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted">Only the company owner can buy job posting credits.</p>
            )}
          </div>
          {payments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center">
              <p className="font-semibold">No payments yet</p>
              <p className="mt-1 text-sm text-muted">A payment appears here after you start checkout.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {payments.map((payment) => (
                <li key={payment.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm">
                  <span className="grid size-12 place-items-center rounded-2xl border border-line bg-canvas text-muted"><CreditCard size={18} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy">{payment.credits} credit</span>
                    <span className="mt-1 block text-sm text-muted">{formatDate(payment.created_at)}</span>
                  </span>
                  <span className="text-sm font-semibold text-navy">{formatMoney(payment.amount, payment.currency)}</span>
                  <span className="text-sm text-muted">{paymentStatusLabel(payment.status)}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </section>
  )
}
