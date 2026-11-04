import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { buttonClass } from '@shared/ui/buttonStyles'
import { PageHeader } from '@shared/ui/PageHeader'
import { notify } from '@shared/ui/toast'
import { ROUTES, jobEditPath } from '@/constants/routes'
import { useCloseJobListing, useDeleteJobListing, useJobListing } from '@/hooks/useJobListings'
import { formatDate, priorityLabel } from '@/services/job-listing.service'
import { JobStatus } from './JobStatus'

const SALARY_TYPE: Record<number, string> = { 1: 'Salary', 2: 'Wage' }
const SALARY_UNIT: Record<number, string> = { 1: 'hour', 2: 'day', 3: 'week', 4: 'fortnight', 5: 'month', 6: 'year' }
const PAY_FREQUENCY: Record<number, string> = { 1: 'Daily', 2: 'Weekly', 3: 'Fortnightly', 4: 'Monthly' }
const EXPERIENCE: Record<number, string> = { 1: 'Entry level', 2: 'Mid level', 3: 'Senior level', 4: 'Executive' }

export function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const job = useJobListing(id)
  const close = useCloseJobListing()
  const remove = useDeleteJobListing()
  const [actionError, setActionError] = useState('')

  if (job.isLoading) return <p role="status" className="text-muted">Loading job listing…</p>
  if (job.isError || !job.data || !id) {
    return (
      <section>
        <Link className="text-sm font-medium text-accent" to={ROUTES.JOBS}>Back to listings</Link>
        <Alert>{errorMessage(job.error, 'Could not load this job listing.')}</Alert>
      </section>
    )
  }

  const record = job.data

  async function onClose() {
    if (!id || !window.confirm('Close this job listing?')) return
    setActionError('')
    try {
      await close.mutateAsync({ id, updatedAt: record.updated_at })
      notify.success('Job listing closed.')
    } catch (error) {
      const message = errorMessage(error, 'Could not close this job listing.')
      setActionError(message)
      notify.error(message)
    }
  }

  async function onDelete() {
    if (!id || !window.confirm('Delete this job listing?')) return
    setActionError('')
    try {
      await remove.mutateAsync(id)
      notify.success('Job listing deleted.')
      navigate(ROUTES.JOBS, { replace: true })
    } catch (error) {
      const message = errorMessage(error, 'Could not delete this job listing.')
      setActionError(message)
      notify.error(message)
    }
  }

  const salary = [record.salary_min, record.salary_max].filter(Boolean).join(' – ')
  const salaryUnit = record.salary_unit ? SALARY_UNIT[record.salary_unit] : ''
  const place = [record.address, record.town?.name, record.island?.name, record.country?.name].filter(Boolean).join(', ')

  return (
    <section>
      <Link className="text-sm font-medium text-accent" to={ROUTES.JOBS}>Back to listings</Link>
      <PageHeader
        eyebrow="HIRING"
        title={record.title}
        description={record.job_types.map((type) => type.name).join(', ') || 'Job listing'}
        action={record.can_edit ? <Link to={jobEditPath(id)} className={buttonClass('secondary')}>Edit</Link> : undefined}
      />
      {actionError ? <div className="mb-4"><Alert>{actionError}</Alert></div> : null}
      {!record.can_edit ? (
        <div className="mb-4">
          <Alert>
            {record.has_applications
              ? 'This listing has applications. You can only close it.'
              : 'This listing is closed or expired and can only be viewed.'}
          </Alert>
        </div>
      ) : null}
      <div className="space-y-6 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <JobStatus status={record.job_listings_status} />
          <span className="text-sm text-muted">Priority: {priorityLabel(record.priority_status)}</span>
        </div>
        <dl className="grid gap-x-8 gap-y-4 text-sm md:grid-cols-2">
          <Fact label="Description" value={record.description} />
          <Fact label="Requirements" value={record.requirements} />
          <Fact label="Required qualification" value={record.required_qualification} />
          <Fact label="Responsibilities" value={record.responsibilities} />
          <Fact label="Benefits" value={record.benefits} />
          <Fact label="Experience" value={record.experience_level ? EXPERIENCE[record.experience_level] : null} />
          <Fact label="Pay" value={[record.salary_type ? SALARY_TYPE[record.salary_type] : null, salary, salaryUnit].filter(Boolean).join(' · ') || null} />
          <Fact label="Pay frequency" value={record.pay_frequency ? PAY_FREQUENCY[record.pay_frequency] : null} />
          <Fact label="Quantity" value={record.quantity?.toString() ?? null} />
          <Fact label="Location" value={place || record.location} />
          <Fact label="Applications" value={record.is_internal_application ? 'Inside MatchingJobs' : record.external_application_url} />
          <Fact label="Published" value={record.published_at ? formatDate(record.published_at) : null} />
          <Fact label="Expires" value={record.expired_at ? formatDate(record.expired_at) : null} />
          <Fact label="Industries" value={names(record.industries)} />
          <Fact label="Categories" value={names(record.categories)} />
          <Fact label="Education" value={names(record.education_levels)} />
          <Fact label="Skills" value={record.skills.join(', ')} />
        </dl>
        <div className="flex flex-wrap gap-3">
          {record.can_close ? (
            <Button variant="secondary" disabled={close.isPending} onClick={() => void onClose()}>
              {close.isPending ? 'Closing…' : 'Close'}
            </Button>
          ) : null}
          <Button variant="danger" disabled={remove.isPending} onClick={() => void onDelete()}>
            {remove.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </div>
    </section>
  )
}

function names(rows: { name: string }[]) {
  return rows.map((row) => row.name).join(', ')
}

function Fact({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="min-w-0">
      <dt className="text-muted">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-wrap break-words font-medium text-navy">{value || '—'}</dd>
    </div>
  )
}
