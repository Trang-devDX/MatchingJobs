import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage } from '@shared/api/errors'
import { cn } from '@shared/lib/cn'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { controlClass } from '@shared/ui/control'
import { PageHeader } from '@shared/ui/PageHeader'
import { jobPath } from '@/constants/routes'
import { useJobs } from '@/hooks/useJobs'

export function JobListPage() {
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const query = useJobs(search, page)
  const jobs = query.data?.jobs ?? []
  const meta = query.data?.meta

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearch(draft.trim())
    setPage(1)
  }

  return (
    <section>
      <PageHeader eyebrow="WORK" title="Open jobs" description={`${meta?.total ?? 0} published jobs`} />
      <form className="mb-4 flex gap-3" onSubmit={onSearch}>
        <input aria-label="Search by title" className={cn(controlClass, 'max-w-md')} value={draft} placeholder="Search by title" onChange={(event) => setDraft(event.target.value)} />
        <Button variant="secondary" type="submit">Search</Button>
      </form>
      {query.isLoading ? <p role="status" className="text-muted">Loading jobs…</p> : null}
      {query.isError ? <Alert>{errorMessage(query.error, 'Could not load jobs.')}</Alert> : null}
      {!query.isLoading && !query.isError && jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center">
          <p className="font-semibold">No open jobs</p>
          <p className="mt-1 text-sm text-muted">Published jobs will show up here.</p>
        </div>
      ) : null}
      <ul className="space-y-3">
        {jobs.map((job) => (
          <li key={job.id}>
            <Link to={jobPath(job.id)} className="block rounded-2xl border border-line bg-white px-5 py-4 hover:border-accent">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{job.title}</p>
                  <p className="mt-1 text-sm text-muted">{job.company_name}</p>
                </div>
                {job.applied ? <span className="text-xs font-medium text-accent">Applied</span> : null}
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
