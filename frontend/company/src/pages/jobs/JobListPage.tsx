import { Briefcase } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage } from '@shared/api/errors'
import { cn } from '@shared/lib/cn'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { buttonClass } from '@shared/ui/buttonStyles'
import { controlClass } from '@shared/ui/control'
import { PageHeader } from '@shared/ui/PageHeader'
import { SelectField } from '@shared/ui/SelectField'
import { ROUTES, jobPath } from '@/constants/routes'
import { useJobCatalog, useJobListings } from '@/hooks/useJobListings'
import { formatDate, type JobFilters } from '@/services/job-listing.service'
import { JobStatus } from './JobStatus'

const emptyFilters = { search: '', status: '', typeId: '', dateFrom: '', dateEnd: '' }

export function JobListPage() {
  const [draft, setDraft] = useState(emptyFilters)
  const [filters, setFilters] = useState<JobFilters>({ ...emptyFilters, page: 1 })
  const query = useJobListings(filters)
  const catalog = useJobCatalog()
  const rows = query.data?.jobs ?? []
  const meta = query.data?.meta

  function onFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFilters({ ...draft, search: draft.search.trim(), page: 1 })
  }

  return (
    <section>
      <PageHeader
        eyebrow="HIRING"
        title="Job listings"
        description={`${meta?.total ?? 0} listings`}
        action={<Link to={ROUTES.JOB_NEW} className={buttonClass('primary')}>New listing</Link>}
      />
      <form className="mb-4 grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-6" onSubmit={onFilter}>
        <label className="block text-sm font-medium text-navy md:col-span-2">
          Title
          <input aria-label="Search by title" className={cn(controlClass, 'mt-1')} value={draft.search} placeholder="Search by title" onChange={(event) => setDraft((current) => ({ ...current, search: event.target.value }))} />
        </label>
        <SelectField label="Status" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}>
          <option value="">All</option>
          <option value="1">Published</option>
          <option value="2">Draft</option>
          <option value="9">Closed</option>
        </SelectField>
        <SelectField label="Job type" value={draft.typeId} onChange={(event) => setDraft((current) => ({ ...current, typeId: event.target.value }))}>
          <option value="">All</option>
          {(catalog.data?.types ?? []).map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
        </SelectField>
        <label className="block text-sm font-medium text-navy">
          From
          <input type="date" className={cn(controlClass, 'mt-1')} value={draft.dateFrom} onChange={(event) => setDraft((current) => ({ ...current, dateFrom: event.target.value }))} />
        </label>
        <label className="block text-sm font-medium text-navy">
          To
          <input type="date" className={cn(controlClass, 'mt-1')} value={draft.dateEnd} onChange={(event) => setDraft((current) => ({ ...current, dateEnd: event.target.value }))} />
        </label>
        <div className="md:col-span-6">
          <Button variant="secondary" type="submit">Filter</Button>
        </div>
      </form>
      {query.isLoading ? <p role="status" className="text-muted">Loading job listings…</p> : null}
      {query.isError ? (
        <Alert>
          {errorMessage(query.error, 'Could not load job listings.')}{' '}
          <Button variant="ghost" onClick={() => void query.refetch()}>Retry</Button>
        </Alert>
      ) : null}
      {!query.isLoading && !query.isError && rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center">
          <p className="font-semibold">No job listings yet</p>
          <p className="mt-1 text-sm text-muted">Create a draft or publish a new listing.</p>
        </div>
      ) : null}
      {rows.length > 0 && meta ? (
        <div className={cn('space-y-3', query.isFetching && 'opacity-70')}>
          <ul className="space-y-3">
            {rows.map((job) => (
              <li key={job.id}>
                <Link className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm transition hover:border-accent/40 hover:shadow-md" to={jobPath(job.id)}>
                  <span className="grid size-12 place-items-center rounded-2xl border border-line bg-canvas text-muted"><Briefcase size={18} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-lg font-semibold text-navy">{job.title}</span>
                    <span className="mt-1 block truncate text-sm text-muted">
                      {[job.job_types.map((type) => type.name).join(', '), formatDate(job.created_at)].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  <JobStatus status={job.job_listings_status} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-sm text-muted">Page {meta.current_page} of {meta.last_page}</span>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={filters.page <= 1 || query.isFetching} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}>Previous</Button>
              <Button variant="secondary" disabled={filters.page >= meta.last_page || query.isFetching} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>Next</Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
