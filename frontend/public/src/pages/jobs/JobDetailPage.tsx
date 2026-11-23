import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { errorMessage } from '@shared/api/errors'
import { cn } from '@shared/lib/cn'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { controlClass } from '@shared/ui/control'
import { PageHeader } from '@shared/ui/PageHeader'
import { notify } from '@shared/ui/toast'
import { applicationPath, ROUTES } from '@/constants/routes'
import { useApply, useJob } from '@/hooks/useJobs'

export function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const job = useJob(id)
  const apply = useApply(id ?? '')
  const [coverLetter, setCoverLetter] = useState('')
  const [formError, setFormError] = useState('')

  if (job.isLoading) return <p role="status" className="text-muted">Loading job…</p>
  if (job.isError || !job.data || !id) {
    return (
      <section>
        <Link className="text-sm font-medium text-accent" to={ROUTES.JOBS}>Back to jobs</Link>
        <Alert>{errorMessage(job.error, 'Could not load this job.')}</Alert>
      </section>
    )
  }

  const record = job.data
  const application = record.application

  async function onApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    try {
      const created = await apply.mutateAsync(coverLetter.trim())
      notify.success('Application submitted.')
      navigate(applicationPath(created.id))
    } catch (error) {
      setFormError(errorMessage(error, 'Could not submit this application.'))
    }
  }

  return (
    <section>
      <Link className="text-sm font-medium text-accent" to={ROUTES.JOBS}>Back to jobs</Link>
      <PageHeader eyebrow={record.company_name ?? 'COMPANY'} title={record.title} description={record.location ?? undefined} />
      {record.description ? <p className="mb-4 whitespace-pre-wrap text-sm leading-6">{record.description}</p> : null}
      {record.requirements ? <Section title="Requirements" body={record.requirements} /> : null}
      {record.responsibilities ? <Section title="Responsibilities" body={record.responsibilities} /> : null}
      {record.benefits ? <Section title="Benefits" body={record.benefits} /> : null}
      {application ? (
        <div className="rounded-2xl border border-line bg-white px-5 py-4">
          <p className="font-semibold">You already applied</p>
          <p className="mt-1 text-sm text-muted">Status: {application.status_label}</p>
          <Link className="mt-3 inline-block text-sm font-medium text-accent" to={applicationPath(application.id)}>View application</Link>
        </div>
      ) : null}
      {!application && !record.is_internal_application ? (
        <a className="text-sm font-medium text-accent" href={record.external_application_url ?? '#'}>Apply on the company site</a>
      ) : null}
      {!application && record.is_internal_application ? (
        <form className="max-w-2xl space-y-3 rounded-2xl border border-line bg-white p-5" onSubmit={onApply}>
          <label className="block text-sm font-medium text-navy">
            Cover letter
            <textarea className={cn(controlClass, 'mt-1 min-h-32')} value={coverLetter} maxLength={5000} onChange={(event) => setCoverLetter(event.target.value)} />
          </label>
          {formError ? <Alert>{formError}</Alert> : null}
          <Button type="submit" disabled={apply.isPending}>{apply.isPending ? 'Submitting…' : 'Apply'}</Button>
        </form>
      ) : null}
    </section>
  )
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="mb-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted">{body}</p>
    </section>
  )
}
