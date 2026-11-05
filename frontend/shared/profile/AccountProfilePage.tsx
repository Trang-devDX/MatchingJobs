import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { applyApiErrors } from '../forms/applyApiErrors'
import { errorMessage } from '../api/errors'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { MediaField } from '../ui/MediaField'
import { PageHeader } from '../ui/PageHeader'
import { notify } from '../ui/toast'
import { TextField } from '../ui/TextField'
import type { AccountProfile, ProfileSaveInput } from './service'

const schema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(255),
  middle_name: z.string().trim().max(255),
  last_name: z.string().trim().min(1, 'Last name is required').max(255),
})

type ProfileForm = z.infer<typeof schema>

function useMediaDraft(savedUrl: string | null | undefined) {
  const [file, setFile] = useState<File | null>(null)
  const [removed, setRemoved] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  function choose(next: File | null) {
    setFile(next)
    setRemoved(false)
    setLocalPreview(next ? URL.createObjectURL(next) : null)
  }

  function clear() {
    if (file) {
      setFile(null)
      setLocalPreview(null)
      return
    }
    setRemoved(true)
  }

  function reset() {
    setFile(null)
    setRemoved(false)
    setLocalPreview(null)
  }

  return {
    file,
    remove: removed && !file,
    preview: localPreview ?? (removed ? null : savedUrl ?? null),
    choose,
    clear,
    reset,
  }
}

export function AccountProfilePage({
  isLoading,
  isError,
  error,
  profile,
  pending,
  onRetry,
  onSave,
}: {
  isLoading: boolean
  isError: boolean
  error: unknown
  profile: AccountProfile | undefined
  pending: boolean
  onRetry: () => void
  onSave: (input: ProfileSaveInput) => Promise<void>
}) {
  const [formError, setFormError] = useState('')
  const [saved, setSaved] = useState('')
  const media = useMediaDraft(profile?.avatar_url)
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    defaultValues: { first_name: '', middle_name: '', last_name: '' },
  })

  useEffect(() => {
    if (!profile) return
    reset({
      first_name: profile.first_name ?? '',
      middle_name: profile.middle_name ?? '',
      last_name: profile.last_name ?? '',
    })
  }, [profile, reset])

  if (isLoading) return <p role="status" className="text-muted">Loading profile…</p>
  if (isError || !profile) {
    return (
      <Alert>
        {errorMessage(error, 'Could not load your profile.')}{' '}
        <Button variant="ghost" onClick={onRetry}>Retry</Button>
      </Alert>
    )
  }

  const submit = handleSubmit(async (values) => {
    setFormError('')
    setSaved('')
    if (!profile.updated_at) {
      setFormError('This profile is missing its update timestamp. Refresh and try again.')
      return
    }
    try {
      await onSave({
        profile: {
          first_name: values.first_name,
          middle_name: values.middle_name || null,
          last_name: values.last_name,
          updated_at: profile.updated_at,
        },
        avatar: media.file,
        removeAvatar: media.remove,
      })
      media.reset()
      setSaved('Profile saved.')
      notify.success('Profile saved.')
    } catch (saveError) {
      const message = applyApiErrors(saveError, setError, 'Could not save your profile.')
      setFormError(message)
      notify.error(message)
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
          preview={media.preview}
          shape="circle"
          onFile={media.choose}
          onRemove={media.clear}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="First name" error={errors.first_name?.message} {...register('first_name')} />
          <TextField label="Middle name" error={errors.middle_name?.message} {...register('middle_name')} />
          <TextField label="Last name" error={errors.last_name?.message} {...register('last_name')} />
          <TextField label="Email" value={profile.email} readOnly />
        </div>
        <Button type="submit" disabled={isSubmitting || pending}>{pending ? 'Saving…' : 'Save profile'}</Button>
      </form>
    </section>
  )
}
