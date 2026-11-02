import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { applyApiErrors } from '@shared/forms/applyApiErrors'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { buttonClass } from '@shared/ui/buttonStyles'
import { PageHeader } from '@shared/ui/PageHeader'
import { SelectField } from '@shared/ui/SelectField'
import { TextField } from '@shared/ui/TextField'
import { ROUTES } from '@/constants/routes'
import { useJobSeeker, useSaveJobSeeker } from '@/hooks/useJobSeekers'
import { buildJobSeekerSchema, emptyJobSeekerForm, toFormValues, toPayload, type JobSeekerFormValues } from './formValues'

export function JobSeekerFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const query = useJobSeeker(id)
  const save = useSaveJobSeeker()
  const [formError, setFormError] = useState('')
  const schema = useMemo(() => buildJobSeekerSchema(isEdit), [isEdit])
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<JobSeekerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyJobSeekerForm,
  })

  useEffect(() => {
    if (query.data) reset(toFormValues(query.data))
  }, [query.data, reset])

  if (isEdit && query.isLoading) return <p role="status" className="text-muted">Loading jobseeker…</p>
  if (isEdit && query.isError) {
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

  const submit = handleSubmit(async (values) => {
    setFormError('')
    try {
      await save.mutateAsync({ id, payload: toPayload(values, isEdit) })
      navigate(ROUTES.JOB_SEEKERS, { replace: true })
    } catch (error) {
      setFormError(applyApiErrors(error, setError, 'Could not save this jobseeker.'))
    }
  })

  return (
    <section>
      <BackLink />
      <PageHeader
        eyebrow="JOBSEEKER MANAGEMENT"
        title={isEdit ? 'Edit jobseeker' : 'Add jobseeker'}
        description="Manage account and profile details."
      />
      <form className="space-y-6 rounded-2xl border border-line bg-white p-6" noValidate onSubmit={submit}>
        {formError ? <Alert>{formError}</Alert> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="First name" autoFocus error={errors.first_name?.message} {...register('first_name')} />
          <TextField label="Middle name" error={errors.middle_name?.message} {...register('middle_name')} />
          <TextField label="Last name" error={errors.last_name?.message} {...register('last_name')} />
          <TextField label="Email" type="email" autoComplete="off" error={errors.email?.message} {...register('email')} />
          <TextField
            label={isEdit ? 'New password (optional)' : 'Password'}
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <TextField label="Phone number" error={errors.phone_number?.message} {...register('phone_number')} />
          <SelectField label="Gender" error={errors.gender?.message} {...register('gender')}>
            <option value="">Not specified</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
            <option value="9">Other</option>
          </SelectField>
          <TextField label="Date of birth" type="date" error={errors.date_of_birth?.message} {...register('date_of_birth')} />
          <SelectField label="Job seeking status" error={errors.job_seeking_status?.message} {...register('job_seeking_status')}>
            <option value="">Not specified</option>
            <option value="1">Seeking</option>
            <option value="2">Not seeking</option>
          </SelectField>
          {isEdit ? (
            <SelectField label="Account status" error={errors.status?.message} {...register('status')}>
              <option value="1">Active</option>
              <option value="9">Disabled</option>
            </SelectField>
          ) : null}
        </div>
        <div className="flex justify-end gap-3">
          <Link to={ROUTES.JOB_SEEKERS} className={buttonClass('secondary')}>Cancel</Link>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save jobseeker'}</Button>
        </div>
      </form>
    </section>
  )
}

function BackLink() {
  return <Link to={ROUTES.JOB_SEEKERS} className={buttonClass('ghost', 'mb-4 px-0')}>← Jobseekers</Link>
}
