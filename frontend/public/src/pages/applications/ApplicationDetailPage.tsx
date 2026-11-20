import { Link, useParams } from 'react-router-dom'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { PageHeader } from '@shared/ui/PageHeader'
import { ROUTES } from '@/constants/routes'
import { useApplication } from '@/hooks/useJobs'

export function ApplicationDetailPage() {
  const { id } = useParams()
  const application = useApplication(id)

  if (application.isLoading) return <p role="status" className="text-muted">Loading application…</p>
  if (application.isError || !application.data) {
    return (
      <section>
        <Link className="text-sm font-medium text-accent" to={ROUTES.APPLICATIONS}>Back to applications</Link>
        <Alert>{errorMessage(application.error, 'Could not load this application.')}</Alert>
      </section>
    )
  }

  const record = application.data

  return (
    <section>
      <Link className="text-sm font-medium text-accent" to={ROUTES.APPLICATIONS}>Back to applications</Link>
      <PageHeader eyebrow={record.company_name ?? 'APPLICATION'} title={record.job_title ?? 'Application'} description={record.status_label} />
      <div className="rounded-2xl border border-line bg-white px-5 py-4">
        <p className="text-sm text-muted">Status</p>
        <p className="font-semibold">{record.status_label}</p>
        {record.cover_letter ? <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{record.cover_letter}</p> : null}
      </div>
    </section>
  )
}
