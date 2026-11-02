import { Link } from 'react-router-dom'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { buttonClass } from '@shared/ui/buttonStyles'
import { PageHeader } from '@shared/ui/PageHeader'
import { StatGrid } from '@shared/ui/StatGrid'
import { ROUTES } from '@/constants/routes'
import { useDashboard } from '@/hooks/useDashboard'

const cards = [
  ['total_job_seekers', 'Jobseekers'],
  ['active_job_seekers', 'Active jobseekers'],
  ['total_jobs', 'Jobs'],
  ['active_jobs', 'Published jobs'],
  ['total_companies', 'Companies'],
] as const

export function DashboardPage() {
  const dashboard = useDashboard()

  return (
    <section>
      <PageHeader
        eyebrow="OVERVIEW"
        title="Dashboard"
        description="Platform activity at a glance."
        action={<Link to={ROUTES.JOB_SEEKERS} className={buttonClass('primary')}>Manage jobseekers</Link>}
      />
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
