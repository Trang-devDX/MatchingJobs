import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { applyApiErrors } from '@shared/forms/applyApiErrors'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { MediaField } from '@shared/ui/MediaField'
import { PageHeader } from '@shared/ui/PageHeader'
import { SelectField } from '@shared/ui/SelectField'
import { TextField } from '@shared/ui/TextField'
import { companyPath } from '@/constants/routes'
import { useSaveStaff, useStaff } from '@/hooks/useCompanies'

const schema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(255),
  middle_name: z.string().trim().max(255),
  last_name: z.string().trim().min(1, 'Last name is required').max(255),
  email: z.string().trim().email('Enter a valid email'),
  password: z.string(),
  phone_number: z.string().trim().max(255),
  position: z.string().trim().max(255),
  status: z.coerce.number().refine((value): value is number => value === 1 || value === 9, 'Choose a status'),
  is_root: z.boolean(),
})

type StaffForm = z.infer<typeof schema>

export function StaffFormPage() {
  const { companyId, staffId } = useParams()
  const isEdit = Boolean(staffId)
  const navigate = useNavigate()
  const staffQuery = useStaff(companyId, staffId)
  const save = useSaveStaff(companyId ?? '')
  const [formError, setFormError] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const formSchema = useMemo(() => schema.refine((values) => isEdit || values.password.length >= 8, {
    path: ['password'],
    message: 'Password must be at least 8 characters',
  }), [isEdit])
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<StaffForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      password: '',
      phone_number: '',
      position: '',
      status: 1,
      is_root: false,
    },
  })

  useEffect(() => {
    if (!staffQuery.data) return
    reset({
      first_name: staffQuery.data.first_name ?? '',
      middle_name: staffQuery.data.middle_name ?? '',
      last_name: staffQuery.data.last_name ?? '',
      email: staffQuery.data.email,
      password: '',
      phone_number: staffQuery.data.phone_number ?? '',
      position: staffQuery.data.position ?? '',
      status: staffQuery.data.status,
      is_root: staffQuery.data.is_root,
    })
  }, [staffQuery.data, reset])

  if (!companyId) return null
  if (isEdit && staffQuery.isLoading) return <p role="status" className="text-muted">Loading staff…</p>
  if (isEdit && (staffQuery.isError || !staffQuery.data)) {
    return (
      <section>
        <Link className="text-sm font-medium text-accent" to={companyPath(companyId)}>Back to company</Link>
        <Alert>{errorMessage(staffQuery.error, 'Could not load this staff account.')}</Alert>
      </section>
    )
  }

  const preview = localPreview ?? (removeAvatar ? null : staffQuery.data?.avatar_url)

  const submit = handleSubmit(async (values) => {
    setFormError('')
    try {
      await save.mutateAsync({
        staffId,
        payload: {
          first_name: values.first_name,
          middle_name: values.middle_name || null,
          last_name: values.last_name,
          email: values.email,
          password: values.password || undefined,
          phone_number: values.phone_number || null,
          position: values.position || null,
          status: values.status,
          is_root: values.is_root,
          avatar,
          remove_avatar: removeAvatar && !avatar,
        },
      })
      navigate(companyPath(companyId), { replace: true })
    } catch (error) {
      setFormError(applyApiErrors(error, setError, 'Could not save this staff account.'))
    }
  })

  return (
    <section>
      <Link className="text-sm font-medium text-accent" to={companyPath(companyId)}>Back to company</Link>
      <PageHeader eyebrow="STAFF" title={isEdit ? 'Edit staff' : 'Add staff'} description="This account signs in on the company portal." />
      <form className="space-y-6 rounded-2xl border border-line bg-white p-6 shadow-sm" noValidate onSubmit={submit}>
        {formError ? <Alert>{formError}</Alert> : null}
        <MediaField
          label="Staff photo"
          hint="JPEG, PNG, or WebP. Maximum 2 MB."
          preview={preview ?? null}
          shape="circle"
          showRemove={Boolean(staffQuery.data?.avatar_url)}
          removeChecked={removeAvatar}
          onRemoveChange={setRemoveAvatar}
          onFile={(file) => {
            setAvatar(file)
            setLocalPreview((current) => {
              if (current) URL.revokeObjectURL(current)
              return file ? URL.createObjectURL(file) : null
            })
            setRemoveAvatar(false)
          }}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="First name" autoFocus error={errors.first_name?.message} {...register('first_name')} />
          <TextField label="Middle name" error={errors.middle_name?.message} {...register('middle_name')} />
          <TextField label="Last name" error={errors.last_name?.message} {...register('last_name')} />
          <TextField label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <TextField label={isEdit ? 'New password (optional)' : 'Password'} type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
          <TextField label="Phone" error={errors.phone_number?.message} {...register('phone_number')} />
          <TextField label="Position" error={errors.position?.message} {...register('position')} />
          <SelectField label="Status" error={errors.status?.message} {...register('status')}>
            <option value={1}>Active</option>
            <option value={9}>Disabled</option>
          </SelectField>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('is_root')} />
          Root staff for this company
        </label>
        <Button type="submit" disabled={isSubmitting || save.isPending}>{save.isPending ? 'Saving…' : 'Save staff'}</Button>
      </form>
    </section>
  )
}
