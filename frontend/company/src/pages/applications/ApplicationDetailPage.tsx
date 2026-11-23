import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { PageHeader } from '@shared/ui/PageHeader'
import { SelectField } from '@shared/ui/SelectField'
import { notify } from '@shared/ui/toast'
import { ROUTES } from '@/constants/routes'
import { useApplication, useUpdateApplication } from '@/hooks/useApplications'
import { applicationStatuses } from '@/services/application.service'

export function ApplicationDetailPage() {
  const { id } = useParams()
  const application = useApplication(id)
  const update = useUpdateApplication(id ?? '')
  const [status, setStatus] = useState('')
  const [formError, setFormError] = useState('')

  if (application.isLoading) return <p role="status" className="text-muted">Loading application…</p>
  if (application.isError || !application.data || !id) {
    return (
      <section>
        <Link className="text-sm font-medium text-accent" to={ROUTES.APPLICATIONS}>Back to applications</Link>
        <Alert>{errorMessage(application.error, 'Could not load this application.')}</Alert>
      </section>
    )
  }

  const record = application.data
  const selected = status || String(record.job_application_status)

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!record.updated_at) return
    setFormError('')
    try {
      await update.mutateAsync({ status: Number(selected), updatedAt: record.updated_at })
      notify.success('Application updated.')
      setStatus('')
    } catch (error) {
      setFormError(errorMessage(error, 'Could not update this application.'))
    }
  }

  return (
    <section>
      <Link className="text-sm font-medium text-accent" to={ROUTES.APPLICATIONS}>Back to applications</Link>
      <PageHeader eyebrow={record.job_title ?? 'APPLICATION'} title={record.job_seeker_name ?? 'Applicant'} description={record.job_seeker_email ?? undefined} />
      {record.cover_letter ? <p className="mb-4 whitespace-pre-wrap text-sm leading-6">{record.cover_letter}</p> : null}
      <form className="max-w-md space-y-3 rounded-2xl border border-line bg-white p-5" onSubmit={onSave}>
        <SelectField label="Status" value={selected} onChange={(event) => setStatus(event.target.value)}>
          <option value="1" disabled>Pending</option>
          {applicationStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </SelectField>
        {formError ? <Alert>{formError}</Alert> : null}
        <Button type="submit" disabled={update.isPending || Number(selected) === record.job_application_status}>
          {update.isPending ? 'Saving…' : 'Update status'}
        </Button>
      </form>
    </section>
  )
}
