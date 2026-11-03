import { Building2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { buttonClass } from '@shared/ui/buttonStyles'
import { controlClass } from '@shared/ui/control'
import { PageHeader } from '@shared/ui/PageHeader'
import { StatusPill } from '@shared/ui/StatusPill'
import { ROUTES, companyEditPath, companyPath } from '@/constants/routes'
import { useCompanies, useDeleteCompany } from '@/hooks/useCompanies'
import { cn } from '@shared/lib/cn'

export function CompanyListPage() {
  const [search, setSearch] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [page, setPage] = useState(1)
  const [actionError, setActionError] = useState('')
  const query = useCompanies(submitted, page)
  const remove = useDeleteCompany()

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPage(1)
    setSubmitted(search.trim())
  }

  async function onDelete(id: string, name: string) {
    if (!window.confirm(`Delete ${name}? Staff accounts of this company will be disabled too.`)) return
    setActionError('')
    try {
      await remove.mutateAsync(id)
    } catch (error) {
      setActionError(errorMessage(error, 'Could not delete this company.'))
    }
  }

  const rows = query.data?.data ?? []
  const meta = query.data?.meta

  return (
    <section>
      <PageHeader
        eyebrow="ORGANIZATIONS"
        title="Companies"
        description={`${meta?.total ?? 0} companies`}
        action={<Link to={ROUTES.COMPANY_NEW} className={buttonClass('primary')}>+ Add company</Link>}
      />
      <form className="mb-4 flex flex-col gap-2 sm:flex-row" onSubmit={onSearch}>
        <input aria-label="Search companies" className={controlClass} value={search} placeholder="Search by name or email" onChange={(event) => setSearch(event.target.value)} />
        <Button variant="secondary" type="submit">Search</Button>
      </form>
      {actionError ? <div className="mb-4"><Alert>{actionError}</Alert></div> : null}
      {query.isLoading ? <p role="status" className="text-muted">Loading companies…</p> : null}
      {query.isError ? (
        <Alert>
          {errorMessage(query.error, 'Could not load companies.')}{' '}
          <Button variant="ghost" onClick={() => void query.refetch()}>Retry</Button>
        </Alert>
      ) : null}
      {!query.isLoading && !query.isError && rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center">
          <p className="font-semibold">No companies found</p>
          <p className="mt-1 text-sm text-muted">Add a company before creating its staff.</p>
        </div>
      ) : null}
      {rows.length > 0 && meta ? (
        <div className={cn('space-y-3', query.isFetching && 'opacity-70')}>
          <ul className="space-y-3">
            {rows.map((company) => (
              <li key={company.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm transition hover:border-accent/40 hover:shadow-md">
                <Link className="flex min-w-0 flex-1 items-center gap-4" to={companyPath(company.id)}>
                  {company.logo_url ? (
                    <img src={company.logo_url} alt="" className="size-16 rounded-2xl border border-line object-cover" />
                  ) : (
                    <span className="grid size-16 place-items-center rounded-2xl border border-line bg-canvas text-muted"><Building2 size={22} /></span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-lg font-semibold text-navy">{company.name}</span>
                    <span className="mt-1 block truncate text-sm text-muted">{[company.country_name, company.email].filter(Boolean).join(' · ') || 'No contact details'}</span>
                  </span>
                </Link>
                <StatusPill active={Number(company.status) === 1} />
                <Link className="text-sm font-semibold text-accent" to={companyEditPath(company.id)}>Edit</Link>
                <button type="button" className="text-sm font-semibold text-danger disabled:opacity-60" disabled={remove.isPending && remove.variables === company.id} onClick={() => void onDelete(company.id, company.name)}>
                  {remove.isPending && remove.variables === company.id ? 'Deleting…' : 'Delete'}
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
