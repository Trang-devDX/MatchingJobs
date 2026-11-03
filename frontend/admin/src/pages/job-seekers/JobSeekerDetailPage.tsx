import { Link, useParams } from 'react-router-dom'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { buttonClass } from '@shared/ui/buttonStyles'
import { PageHeader } from '@shared/ui/PageHeader'
import { StatusPill } from '@shared/ui/StatusPill'
import { formatDate, genderLabel, seekingLabel } from '@/constants/jobSeeker'
import { ROUTES, jobSeekerEditPath } from '@/constants/routes'
import { useJobSeeker } from '@/hooks/useJobSeekers'

export function JobSeekerDetailPage() {
  const { id } = useParams()
  const query = useJobSeeker(id)

  if (query.isLoading) return <p role="status" className="text-muted">Loading jobseeker…</p>
  if (query.isError || !query.data) {
    return (
      <section>
        <BackLink />
        <Alert>
          {errorMessage(query.error, 'Could not load this jobseeker.')}{' '}
          <Button variant="ghost" onClick={() => void query.refetch()}>Retry</Button>
        </Alert>
      </section>
    )
  }

  const jobSeeker = query.data

  return (
    <section>
      <BackLink />
      <PageHeader
        eyebrow="JOBSEEKER PROFILE"
        title={jobSeeker.name || jobSeeker.email}
        description={jobSeeker.email}
        action={<Link to={jobSeekerEditPath(jobSeeker.id)} className={buttonClass('primary')}>Edit profile</Link>}
      />
      <dl className="grid gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2">
        <DetailItem label="Phone number" value={jobSeeker.phone_number || '—'} />
        <DetailItem label="Gender" value={genderLabel(jobSeeker.gender)} />
        <DetailItem label="Date of birth" value={jobSeeker.date_of_birth?.slice(0, 10) || '—'} />
        <DetailItem label="Job seeking status" value={seekingLabel(jobSeeker.job_seeking_status)} />
        <div>
          <dt className="text-sm text-muted">Account status</dt>
          <dd className="mt-1"><StatusPill active={Number(jobSeeker.status) === 1} /></dd>
        </div>
        <DetailItem label="Registered" value={formatDate(jobSeeker.created_at)} />
      </dl>
    </section>
  )
}

function BackLink() {
  return <Link to={ROUTES.JOB_SEEKERS} className={buttonClass('ghost', 'mb-4 px-0')}>← Jobseekers</Link>
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 font-medium text-navy">{value || '—'}</dd>
    </div>
  )
}
