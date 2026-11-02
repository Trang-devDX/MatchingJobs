import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { buttonClass } from '@shared/ui/buttonStyles'
import { PageHeader } from '@shared/ui/PageHeader'
import { controlClass } from '@shared/ui/control'
import { accountStatusLabel } from '@/constants/jobSeeker'
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
    } catch (error) {
      setActionError(errorMessage(error, 'Could not delete this jobseeker.'))
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
        <div className={cn('overflow-x-auto rounded-2xl border border-line bg-white', query.isFetching && 'opacity-70')}>
          <table className="w-full text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((jobSeeker) => {
                const active = Number(jobSeeker.status) === 1
                return (
                  <tr key={jobSeeker.id} className="border-t border-line">
                    <td className="px-4 py-3">
                      <Link className="font-medium text-brand" to={jobSeekerPath(jobSeeker.id)}>{jobSeeker.name || '—'}</Link>
                    </td>
                    <td className="px-4 py-3">{jobSeeker.email}</td>
                    <td className="px-4 py-3">{jobSeeker.phone_number || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', active ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-danger')}>
                        {accountStatusLabel(jobSeeker.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link className="font-medium text-brand" to={jobSeekerEditPath(jobSeeker.id)}>Edit</Link>
                      <button
                        type="button"
                        className="ml-3 font-medium text-danger disabled:opacity-60"
                        disabled={remove.isPending && remove.variables === jobSeeker.id}
                        onClick={() => void onDelete(jobSeeker.id, jobSeeker.name || jobSeeker.email)}
                      >
                        {remove.isPending && remove.variables === jobSeeker.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
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
