import { errorMessage } from '@shared/api/errors'
import { useAuth } from '@shared/auth/context'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { PageHeader } from '@shared/ui/PageHeader'
import { StatGrid } from '@shared/ui/StatGrid'
import { FALLBACK_NAME } from '@/constants/copy'
import { useDashboard } from '@/hooks/useDashboard'

const cards = [
  ['total_jobs', 'Total job listings'],
  ['published_jobs', 'Published listings'],
  ['total_applications', 'Total applications'],
  ['pending_applications', 'Applications to review'],
] as const

export function DashboardPage() {
  const { user } = useAuth()
  const dashboard = useDashboard()
  const name = user?.name || FALLBACK_NAME

  return (
    <section>
      <PageHeader eyebrow="COMPANY OVERVIEW" title={`Hello, ${name}`} description="Hiring activity for your company." />
      {dashboard.isLoading ? <p role="status" className="text-muted">Loading dashboard…</p> : null}
      {dashboard.isError ? (
        <Alert>
          {errorMessage(dashboard.error, 'Could not load the dashboard.')}{' '}
          <Button variant="ghost" onClick={() => void dashboard.refetch()}>Retry</Button>
        </Alert>
      ) : null}
      {dashboard.data ? (
        <StatGrid
          items={cards.map(([key, label]) => ({
            key,
            label,
            value: Number(dashboard.data?.[key] ?? 0),
          }))}
        />
      ) : null}
    </section>
  )
}
