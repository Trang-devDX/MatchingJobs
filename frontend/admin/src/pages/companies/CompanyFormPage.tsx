import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
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
import { companyPath, ROUTES } from '@/constants/routes'
import { useCompany, useCountries, useSaveCompany } from '@/hooks/useCompanies'

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(255),
  status: z.coerce.number().refine((value): value is number => value === 1 || value === 9, 'Choose a status'),
  email: z.string().trim().email('Enter a valid email').or(z.literal('')),
  phone_number: z.string().trim().max(255),
  website_url: z.string().trim().url('Enter a valid URL').or(z.literal('')),
  description: z.string().trim().max(5000),
  country_id: z.string().uuid('Choose a country'),
  address: z.string().trim().max(1000),
})

type CompanyForm = z.infer<typeof schema>

const emptyForm: CompanyForm = {
  name: '',
  status: 1,
  email: '',
  phone_number: '',
  website_url: '',
  description: '',
  country_id: '',
  address: '',
}

export function CompanyFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const companyQuery = useCompany(id)
  const countries = useCountries()
  const save = useSaveCompany()
  const [formError, setFormError] = useState('')
  const [logo, setLogo] = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [removeLogo, setRemoveLogo] = useState(false)
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<CompanyForm>({
    resolver: zodResolver(schema),
    defaultValues: emptyForm,
  })

  useEffect(() => {
    if (!companyQuery.data) return
    reset({
      name: companyQuery.data.name,
      status: companyQuery.data.status,
      email: companyQuery.data.email ?? '',
      phone_number: companyQuery.data.phone_number ?? '',
      website_url: companyQuery.data.website_url ?? '',
      description: companyQuery.data.description ?? '',
      country_id: companyQuery.data.country_id,
      address: companyQuery.data.address ?? '',
    })
  }, [companyQuery.data, reset])

  if (isEdit && companyQuery.isLoading) return <p role="status" className="text-muted">Loading company…</p>
  if (isEdit && (companyQuery.isError || !companyQuery.data)) {
    return (
      <section>
        <Link className="text-sm font-medium text-accent" to={ROUTES.COMPANIES}>Back to companies</Link>
        <Alert>{errorMessage(companyQuery.error, 'Could not load this company.')}</Alert>
      </section>
    )
  }

  const preview = localPreview ?? (removeLogo ? null : companyQuery.data?.logo_url)

  const submit = handleSubmit(async (values) => {
    setFormError('')
    try {
      const saved = await save.mutateAsync({
        id,
        payload: {
          ...values,
          email: values.email || null,
          phone_number: values.phone_number || null,
          website_url: values.website_url || null,
          description: values.description || null,
          address: values.address || null,
          logo,
          remove_logo: removeLogo && !logo,
        },
      })
      navigate(companyPath(saved.id), { replace: true })
    } catch (error) {
      setFormError(applyApiErrors(error, setError, 'Could not save this company.'))
    }
  })

  return (
    <section>
      <Link className="text-sm font-medium text-accent" to={isEdit && id ? companyPath(id) : ROUTES.COMPANIES}>Back</Link>
      <PageHeader eyebrow="ORGANIZATIONS" title={isEdit ? 'Edit company' : 'Add company'} description="Name, country, and logo. The logo is a public image." />
      <form className="space-y-6 rounded-2xl border border-line bg-white p-6 shadow-sm" noValidate onSubmit={submit}>
        {formError ? <Alert>{formError}</Alert> : null}
        {countries.data?.length === 0 ? <Alert>No countries are seeded yet. Run the country seeder before creating a company.</Alert> : null}
        <MediaField
          label="Company logo"
          hint="JPEG, PNG, or WebP. Maximum 2 MB."
          preview={preview ?? null}
          showRemove={Boolean(companyQuery.data?.logo_url)}
          removeChecked={removeLogo}
          onRemoveChange={setRemoveLogo}
          onFile={(file) => {
            setLogo(file)
            setLocalPreview((current) => {
              if (current) URL.revokeObjectURL(current)
              return file ? URL.createObjectURL(file) : null
            })
            setRemoveLogo(false)
          }}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Name" autoFocus error={errors.name?.message} {...register('name')} />
          <SelectField label="Status" error={errors.status?.message} {...register('status')}>
            <option value={1}>Active</option>
            <option value={9}>Disabled</option>
          </SelectField>
          <SelectField label="Country" error={errors.country_id?.message} {...register('country_id')}>
            <option value="">Choose a country</option>
            {(countries.data ?? []).map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}
          </SelectField>
          <TextField label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <TextField label="Phone" error={errors.phone_number?.message} {...register('phone_number')} />
          <TextField label="Website" error={errors.website_url?.message} {...register('website_url')} />
          <TextField label="Address" className="md:col-span-2" error={errors.address?.message} {...register('address')} />
        </div>
        <label className="block text-sm font-medium text-navy">
          Description
          <textarea className="mt-1 w-full rounded-xl border border-line px-3 py-2" rows={4} {...register('description')} />
          {errors.description ? <span className="mt-1 block text-sm font-normal text-danger">{errors.description.message}</span> : null}
        </label>
        <Button type="submit" disabled={isSubmitting || save.isPending}>{save.isPending ? 'Saving…' : 'Save company'}</Button>
      </form>
    </section>
  )
}
