import { useState } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { PageHeader } from '@shared/ui/PageHeader'
import { applicationPath } from '@/constants/routes'
import { useApplications } from '@/hooks/useApplications'

export function ApplicationListPage() {
  const [page, setPage] = useState(1)
  const query = useApplications(page)
  const rows = query.data?.applications ?? []
  const meta = query.data?.meta

  return (
    <section>
      <PageHeader eyebrow="CANDIDATES" title="Applications" description={`${meta?.total ?? 0} applications`} />
      {query.isLoading ? <p role="status" className="text-muted">Loading applications…</p> : null}
      {query.isError ? <Alert>{errorMessage(query.error, 'Could not load applications.')}</Alert> : null}
      {!query.isLoading && !query.isError && rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center">
          <p className="font-semibold">No applications yet</p>
          <p className="mt-1 text-sm text-muted">Applications appear here after a job seeker applies.</p>
        </div>
      ) : null}
      <ul className="space-y-3">
        {rows.map((application) => (
          <li key={application.id}>
            <Link to={applicationPath(application.id)} className="block rounded-2xl border border-line bg-white px-5 py-4 hover:border-accent">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{application.job_seeker_name}</p>
                  <p className="mt-1 text-sm text-muted">{application.job_title}</p>
                </div>
                <span className="text-xs font-medium text-accent">{application.status_label}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {meta && meta.last_page > 1 ? (
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</Button>
          <Button variant="secondary" disabled={page >= meta.last_page} onClick={() => setPage((current) => current + 1)}>Next</Button>
        </div>
      ) : null}
    </section>
  )
}
