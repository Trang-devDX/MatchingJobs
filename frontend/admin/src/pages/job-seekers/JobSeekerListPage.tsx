import { UserRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { buttonClass } from '@shared/ui/buttonStyles'
import { PageHeader } from '@shared/ui/PageHeader'
import { notify } from '@shared/ui/toast'
import { StatusPill } from '@shared/ui/StatusPill'
import { controlClass } from '@shared/ui/control'
import { ROUTES, jobSeekerEditPath, jobSeekerPath } from '@/constants/routes'
import { useDeleteJobSeeker, useJobSeekers } from '@/hooks/useJobSeekers'
import { cn } from '@shared/lib/cn'

export function JobSeekerListPage() {
  const [search, setSearch] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [page, setPage] = useState(1)
  const [actionError, setActionError] = useState('')
  const query = useJobSeekers(submitted, page)
  const remove = useDeleteJobSeeker()

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPage(1)
    setSubmitted(search.trim())
  }

  async function onDelete(id: string, label: string) {
    if (!window.confirm(`Delete ${label}?`)) return
    setActionError('')
    try {
      await remove.mutateAsync(id)
      notify.success('Jobseeker deleted.')
    } catch (error) {
      const message = errorMessage(error, 'Could not delete this jobseeker.')
      setActionError(message)
      notify.error(message)
    }
  }

  const rows = query.data?.data ?? []
  const meta = query.data?.meta

  return (
    <section>
      <PageHeader
        eyebrow="ACCOUNTS"
        title="Jobseekers"
        description={`${meta?.total ?? 0} registered accounts`}
        action={<Link to={ROUTES.JOB_SEEKER_NEW} className={buttonClass('primary')}>+ Add jobseeker</Link>}
      />
      <form className="mb-4 flex flex-col gap-2 sm:flex-row" onSubmit={onSearch}>
        <input
          aria-label="Search jobseekers"
          className={controlClass}
          value={search}
          placeholder="Search by name or email"
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button variant="secondary" type="submit">Search</Button>
      </form>
      {actionError ? <div className="mb-4"><Alert>{actionError}</Alert></div> : null}
      {query.isLoading ? <p role="status" className="text-muted">Loading jobseekers…</p> : null}
      {query.isError ? (
        <Alert>
          {errorMessage(query.error, 'Could not load jobseekers.')}{' '}
          <Button variant="ghost" onClick={() => void query.refetch()}>Retry</Button>
        </Alert>
      ) : null}
      {!query.isLoading && !query.isError && rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center">
          <p className="font-semibold">No jobseekers found</p>
          <p className="mt-1 text-sm text-muted">Try another search or add a new account.</p>
        </div>
      ) : null}
      {rows.length > 0 && meta ? (
        <div className={cn('space-y-3', query.isFetching && 'opacity-70')}>
          <ul className="space-y-3">
            {rows.map((jobSeeker) => (
              <li key={jobSeeker.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm transition hover:border-accent/40 hover:shadow-md">
                <Link className="flex min-w-0 flex-1 items-center gap-4" to={jobSeekerPath(jobSeeker.id)}>
                  <span className="grid size-14 place-items-center rounded-full border border-line bg-canvas text-muted"><UserRound size={20} /></span>
                  <span className="min-w-0">
                    <span className="block truncate text-lg font-semibold text-navy">{jobSeeker.name || '—'}</span>
                    <span className="mt-1 block truncate text-sm text-muted">{[jobSeeker.email, jobSeeker.phone_number].filter(Boolean).join(' · ')}</span>
                  </span>
                </Link>
                <StatusPill active={Number(jobSeeker.status) === 1} />
                <Link className="text-sm font-semibold text-accent" to={jobSeekerEditPath(jobSeeker.id)}>Edit</Link>
                <button
                  type="button"
                  className="text-sm font-semibold text-danger disabled:opacity-60"
                  disabled={remove.isPending && remove.variables === jobSeeker.id}
                  onClick={() => void onDelete(jobSeeker.id, jobSeeker.name || jobSeeker.email)}
                >
                  {remove.isPending && remove.variables === jobSeeker.id ? 'Deleting…' : 'Delete'}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-sm text-muted">Page {meta.current_page} of {meta.last_page}</span>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={page <= 1 || query.isFetching} onClick={() => setPage((current) => current - 1)}>Previous</Button>
              <Button variant="secondary" disabled={page >= meta.last_page || query.isFetching} onClick={() => setPage((current) => current + 1)}>Next</Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
