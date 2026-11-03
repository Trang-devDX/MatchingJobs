import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { applyApiErrors } from '@shared/forms/applyApiErrors'
import { errorMessage } from '@shared/api/errors'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { MediaField } from '@shared/ui/MediaField'
import { PageHeader } from '@shared/ui/PageHeader'
import { TextField } from '@shared/ui/TextField'
import { useProfile, useSaveProfile } from '@/hooks/useProfile'

const schema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(255),
  middle_name: z.string().trim().max(255),
  last_name: z.string().trim().min(1, 'Last name is required').max(255),
})

type ProfileForm = z.infer<typeof schema>

export function ProfilePage() {
  const query = useProfile()
  const save = useSaveProfile()
  const [formError, setFormError] = useState('')
  const [saved, setSaved] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    defaultValues: { first_name: '', middle_name: '', last_name: '' },
  })

  useEffect(() => {
    if (!query.data) return
    reset({
      first_name: query.data.first_name ?? '',
      middle_name: query.data.middle_name ?? '',
      last_name: query.data.last_name ?? '',
    })
  }, [query.data, reset])

  if (query.isLoading) return <p role="status" className="text-muted">Loading profile…</p>
  if (query.isError || !query.data) {
    return (
      <Alert>
        {errorMessage(query.error, 'Could not load your profile.')}{' '}
        <Button variant="ghost" onClick={() => void query.refetch()}>Retry</Button>
      </Alert>
    )
  }

  const profile = query.data
  const preview = localPreview ?? (removeAvatar ? null : profile.avatar_url)

  const submit = handleSubmit(async (values) => {
    setFormError('')
    setSaved('')
    if (!profile.updated_at) {
      setFormError('This profile is missing its update timestamp. Refresh and try again.')
      return
    }
    try {
      await save.mutateAsync({
        profile: {
          first_name: values.first_name,
          middle_name: values.middle_name || null,
          last_name: values.last_name,
          updated_at: profile.updated_at,
        },
        avatar,
        removeAvatar: removeAvatar && !avatar,
      })
      setAvatar(null)
      setRemoveAvatar(false)
      setSaved('Profile saved.')
    } catch (error) {
      setFormError(applyApiErrors(error, setError, 'Could not save your profile.'))
    }
  })

  return (
    <section>
      <PageHeader eyebrow="ACCOUNT" title="Your profile" description="Update your name and avatar. Email stays tied to sign-in." />
      <form className="space-y-6 rounded-2xl border border-line bg-white p-6 shadow-sm" noValidate onSubmit={submit}>
        {formError ? <Alert>{formError}</Alert> : null}
        {saved ? <p role="status" className="text-sm font-medium text-success">{saved}</p> : null}
        <MediaField
          label="Profile photo"
          hint="JPEG, PNG, or WebP. Maximum 2 MB."
          preview={preview}
          shape="circle"
          showRemove={Boolean(profile.avatar_url)}
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
          <TextField label="Email" value={profile.email} readOnly />
        </div>
        <Button type="submit" disabled={isSubmitting || save.isPending}>{save.isPending ? 'Saving…' : 'Save profile'}</Button>
      </form>
    </section>
  )
}
