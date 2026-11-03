import { Building2, UserRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { buttonClass } from '@shared/ui/buttonStyles'
import { controlClass } from '@shared/ui/control'
import { PageHeader } from '@shared/ui/PageHeader'
import { StatusPill } from '@shared/ui/StatusPill'
import { ROUTES, companyEditPath, staffEditPath, staffNewPath } from '@/constants/routes'
import { useCompany, useDeleteStaff, useStaffs } from '@/hooks/useCompanies'
import { cn } from '@shared/lib/cn'

export function CompanyDetailPage() {
  const { id } = useParams()
  const company = useCompany(id)
  const [search, setSearch] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [page, setPage] = useState(1)
  const [actionError, setActionError] = useState('')
  const staffs = useStaffs(id ?? '', submitted, page)
  const remove = useDeleteStaff(id ?? '')

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPage(1)
    setSubmitted(search.trim())
  }

  async function onDelete(staffId: string, label: string) {
    if (!id || !window.confirm(`Delete ${label}?`)) return
    setActionError('')
    try {
      await remove.mutateAsync(staffId)
    } catch (error) {
      setActionError(errorMessage(error, 'Could not delete this staff account.'))
    }
  }

  if (company.isLoading) return <p role="status" className="text-muted">Loading company…</p>
  if (company.isError || !company.data || !id) {
    return (
      <section>
        <Link className="text-sm font-medium text-accent" to={ROUTES.COMPANIES}>Back to companies</Link>
        <Alert>{errorMessage(company.error, 'Could not load this company.')}</Alert>
      </section>
    )
  }

  const rows = staffs.data?.data ?? []
  const meta = staffs.data?.meta
  const record = company.data

  return (
    <section>
      <Link className="text-sm font-medium text-accent" to={ROUTES.COMPANIES}>Back to companies</Link>
      <PageHeader
        eyebrow="ORGANIZATIONS"
        title={record.name}
        description={record.country_name || 'Company'}
        action={<Link to={companyEditPath(id)} className={buttonClass('secondary')}>Edit company</Link>}
      />
      <div className="mb-8 flex flex-wrap items-start gap-5 rounded-2xl border border-line bg-white p-6 shadow-sm">
        {record.logo_url ? (
          <img src={record.logo_url} alt="" className="size-24 rounded-2xl border border-line object-cover" />
        ) : (
          <span className="grid size-24 place-items-center rounded-2xl border border-line bg-canvas text-muted"><Building2 size={28} /></span>
        )}
        <div className="min-w-0 flex-1">
          <StatusPill active={Number(record.status) === 1} />
          <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm md:grid-cols-2">
            <div className="min-w-0"><dt className="text-muted">Email</dt><dd className="mt-0.5 break-words font-medium text-navy">{record.email || '—'}</dd></div>
            <div className="min-w-0"><dt className="text-muted">Phone</dt><dd className="mt-0.5 break-words font-medium text-navy">{record.phone_number || '—'}</dd></div>
            <div className="min-w-0"><dt className="text-muted">Website</dt><dd className="mt-0.5 break-words font-medium text-navy">{record.website_url || '—'}</dd></div>
            <div className="min-w-0"><dt className="text-muted">Address</dt><dd className="mt-0.5 break-words font-medium text-navy">{record.address || '—'}</dd></div>
          </dl>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-navy">Staff</h2>
        <Link to={staffNewPath(id)} className={buttonClass('primary')}>+ Add staff</Link>
      </div>
      <form className="mb-4 flex flex-col gap-2 sm:flex-row" onSubmit={onSearch}>
        <input aria-label="Search staff" className={controlClass} value={search} placeholder="Search by name or email" onChange={(event) => setSearch(event.target.value)} />
        <Button variant="secondary" type="submit">Search</Button>
      </form>
      {actionError ? <div className="mb-4"><Alert>{actionError}</Alert></div> : null}
      {staffs.isLoading ? <p role="status" className="text-muted">Loading staff…</p> : null}
      {staffs.isError ? <Alert>{errorMessage(staffs.error, 'Could not load staff.')}</Alert> : null}
      {!staffs.isLoading && !staffs.isError && rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center">
          <p className="font-semibold">No staff yet</p>
        </div>
      ) : null}
      {rows.length > 0 && meta ? (
        <div className={cn('space-y-3', staffs.isFetching && 'opacity-70')}>
          <ul className="space-y-3">
            {rows.map((staff) => (
              <li key={staff.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm">
                {staff.avatar_url ? (
                  <img src={staff.avatar_url} alt="" className="size-14 rounded-full border border-line object-cover" />
                ) : (
                  <span className="grid size-14 place-items-center rounded-full border border-line bg-canvas text-muted"><UserRound size={20} /></span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-base font-semibold text-navy">{staff.name || '—'}</span>
                    {staff.is_root ? <span className="rounded-full bg-canvas px-2 py-0.5 text-xs font-semibold text-navy">Root</span> : null}
                  </span>
                  <span className="mt-1 block truncate text-sm text-muted">{[staff.position, staff.email].filter(Boolean).join(' · ')}</span>
                </span>
                <StatusPill active={Number(staff.status) === 1} />
                <Link className="text-sm font-semibold text-accent" to={staffEditPath(id, staff.id)}>Edit</Link>
                <button type="button" className="text-sm font-semibold text-danger" onClick={() => void onDelete(staff.id, staff.name || staff.email)}>Delete</button>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-sm text-muted">Page {meta.current_page} of {meta.last_page}</span>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</Button>
              <Button variant="secondary" disabled={page >= meta.last_page} onClick={() => setPage((current) => current + 1)}>Next</Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
