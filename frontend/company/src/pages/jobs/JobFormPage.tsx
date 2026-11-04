import { zodResolver } from '@hookform/resolvers/zod'
import { forwardRef, useEffect, useMemo, useState, type TextareaHTMLAttributes } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { applyApiErrors } from '@shared/forms/applyApiErrors'
import { errorMessage } from '@shared/api/errors'
import { cn } from '@shared/lib/cn'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { controlClass } from '@shared/ui/control'
import { PageHeader } from '@shared/ui/PageHeader'
import { notify } from '@shared/ui/toast'
import { SelectField } from '@shared/ui/SelectField'
import { TextField } from '@shared/ui/TextField'
import { jobPath, ROUTES } from '@/constants/routes'
import { useCompanyPlace, useIslands, useJobCatalog, useJobListing, useSaveJobListing, useTowns } from '@/hooks/useJobListings'
import { dateInputValue, type JobListing, type JobPayload, type Named } from '@/services/job-listing.service'

const salaryTypes = [
  ['1', 'Salary'],
  ['2', 'Wage'],
] as const
const salaryUnits = [
  ['1', 'Hour'],
  ['2', 'Day'],
  ['3', 'Week'],
  ['4', 'Fortnight'],
  ['5', 'Month'],
  ['6', 'Year'],
] as const
const payFrequencies = [
  ['1', 'Daily'],
  ['2', 'Weekly'],
  ['3', 'Fortnightly'],
  ['4', 'Monthly'],
] as const
const experienceLevels = [
  ['1', 'Entry level'],
  ['2', 'Mid level'],
  ['3', 'Senior level'],
  ['4', 'Executive'],
] as const

const jobSchema = (creating: boolean) => z.object({
  title: z.string().trim().min(1, 'Enter a title').max(255),
  job_listings_status: z.coerce.number(),
  priority_status: z.coerce.number(),
  description: z.string().trim().max(20000),
  requirements: z.string().trim().max(20000),
  required_qualification: z.string().trim().max(20000),
  responsibilities: z.string().trim().max(20000),
  benefits: z.string().trim().max(20000),
  salary_min: z.string().trim(),
  salary_max: z.string().trim(),
  salary_type: z.string(),
  salary_unit: z.string(),
  pay_frequency: z.string(),
  experience_level: z.string(),
  quantity: z.string().trim(),
  use_company_address: z.boolean(),
  country_id: z.string().uuid('Choose a country'),
  island_id: z.string().uuid('Choose a region'),
  town_id: z.string().uuid('Choose a town'),
  location: z.string().trim().max(2000),
  address: z.string().trim().max(2000),
  latitude: z.string().trim(),
  longitude: z.string().trim(),
  is_internal_application: z.boolean(),
  external_application_url: z.string().trim().max(255),
  published_at: z.string(),
  expired_at: z.string(),
  industry_ids: z.array(z.string()),
  category_ids: z.array(z.string()),
  type_ids: z.array(z.string()),
  education_level_ids: z.array(z.string()),
  skills: z.array(z.string().max(200, 'Each skill can be at most 200 characters')),
}).superRefine((values, context) => {
  const statuses = creating ? [1, 2] : [1, 2, 9]
  if (!statuses.includes(values.job_listings_status)) {
    context.addIssue({ code: 'custom', path: ['job_listings_status'], message: 'Choose a status' })
  }
  if (![1, 2, 3].includes(values.priority_status)) {
    context.addIssue({ code: 'custom', path: ['priority_status'], message: 'Choose a priority' })
  }

  const min = optionalNumber(values.salary_min)
  const max = optionalNumber(values.salary_max)
  if (values.salary_min && (min === null || min < 0)) {
    context.addIssue({ code: 'custom', path: ['salary_min'], message: 'Enter a valid minimum pay' })
  }
  if (values.salary_max && (max === null || max < 0)) {
    context.addIssue({ code: 'custom', path: ['salary_max'], message: 'Enter a valid maximum pay' })
  }
  if (min !== null && max !== null && max < min) {
    context.addIssue({ code: 'custom', path: ['salary_max'], message: 'Maximum pay must be greater than or equal to minimum pay' })
  }
  if (values.quantity) {
    const quantity = Number(values.quantity)
    if (!Number.isInteger(quantity) || quantity < 1) {
      context.addIssue({ code: 'custom', path: ['quantity'], message: 'Quantity must be a whole number of at least 1' })
    }
  }
  bound(values.latitude, -90, 90, 'latitude', 'Latitude must be between -90 and 90', context)
  bound(values.longitude, -180, 180, 'longitude', 'Longitude must be between -180 and 180', context)

  if (creating && values.published_at && values.published_at < todayInput()) {
    context.addIssue({ code: 'custom', path: ['published_at'], message: 'The publish date cannot be before today' })
  }
  if (values.published_at && values.expired_at && values.expired_at <= values.published_at) {
    context.addIssue({ code: 'custom', path: ['expired_at'], message: 'The expiry date must be after the publish date' })
  }
  if (!values.is_internal_application) {
    if (!values.external_application_url) {
      context.addIssue({ code: 'custom', path: ['external_application_url'], message: 'Enter an external application URL' })
    } else if (!z.string().url().safeParse(values.external_application_url).success) {
      context.addIssue({ code: 'custom', path: ['external_application_url'], message: 'Enter a valid URL' })
    }
  }
})

type JobForm = z.input<ReturnType<typeof jobSchema>>

const emptyForm: JobForm = {
  title: '',
  job_listings_status: 2,
  priority_status: 2,
  description: '',
  requirements: '',
  required_qualification: '',
  responsibilities: '',
  benefits: '',
  salary_min: '',
  salary_max: '',
  salary_type: '',
  salary_unit: '',
  pay_frequency: '',
  experience_level: '',
  quantity: '',
  use_company_address: false,
  country_id: '',
  island_id: '',
  town_id: '',
  location: '',
  address: '',
  latitude: '',
  longitude: '',
  is_internal_application: true,
  external_application_url: '',
  published_at: '',
  expired_at: '',
  industry_ids: [],
  category_ids: [],
  type_ids: [],
  education_level_ids: [],
  skills: [],
}

export function JobFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const jobQuery = useJobListing(id)
  const catalog = useJobCatalog()
  const company = useCompanyPlace()
  const save = useSaveJobListing()
  const [formError, setFormError] = useState('')
  const [skillDraft, setSkillDraft] = useState('')
  const schema = useMemo(() => jobSchema(!isEdit), [isEdit])
  const { register, handleSubmit, reset, setError, setValue, control, formState: { errors, isSubmitting } } = useForm<JobForm>({
    resolver: zodResolver(schema),
    defaultValues: emptyForm,
  })
  const countryId = useWatch({ control, name: 'country_id' })
  const islandId = useWatch({ control, name: 'island_id' })
  const townId = useWatch({ control, name: 'town_id' })
  const internal = useWatch({ control, name: 'is_internal_application' })
  const skills = useWatch({ control, name: 'skills' }) ?? []
  const industryIds = useWatch({ control, name: 'industry_ids' }) ?? []
  const categoryIds = useWatch({ control, name: 'category_ids' }) ?? []
  const typeIds = useWatch({ control, name: 'type_ids' }) ?? []
  const educationIds = useWatch({ control, name: 'education_level_ids' }) ?? []
  const islands = useIslands(countryId)
  const towns = useTowns(islandId)

  useEffect(() => {
    if (!jobQuery.data) return
    reset(toForm(jobQuery.data))
  }, [jobQuery.data, reset])

  if (isEdit && jobQuery.isLoading) return <p role="status" className="text-muted">Loading job listing…</p>
  if (isEdit && (jobQuery.isError || !jobQuery.data || !id)) {
    return (
      <section>
        <Link className="text-sm font-medium text-accent" to={ROUTES.JOBS}>Back to listings</Link>
        <Alert>{errorMessage(jobQuery.error, 'Could not load this job listing.')}</Alert>
      </section>
    )
  }
  if (isEdit && jobQuery.data && !jobQuery.data.can_edit && id) {
    return (
      <section>
        <Link className="text-sm font-medium text-accent" to={jobPath(id)}>Back to listing</Link>
        <Alert>This listing is closed, expired, or already has applications, so it cannot be edited.</Alert>
      </section>
    )
  }

  const addressField = register('use_company_address')
  const countryField = register('country_id')
  const islandField = register('island_id')

  function copyCompanyAddress(checked: boolean) {
    const place = company.data
    if (checked && !place) {
      setValue('use_company_address', false)
      notify.warning('Company address is not available yet.')
      return
    }
    if (checked && place) {
      setValue('country_id', place.country?.id ?? '')
      setValue('island_id', place.island?.id ?? '')
      setValue('town_id', place.town?.id ?? '')
      setValue('address', place.address ?? '')
      setValue('location', place.specific_location ?? '')
      setValue('latitude', place.latitude == null ? '' : String(place.latitude))
      setValue('longitude', place.longitude == null ? '' : String(place.longitude))
      return
    }
    setValue('country_id', '')
    setValue('island_id', '')
    setValue('town_id', '')
    setValue('address', '')
    setValue('location', '')
    setValue('latitude', '')
    setValue('longitude', '')
  }

  function toggle(name: 'industry_ids' | 'category_ids' | 'type_ids' | 'education_level_ids', current: string[], value: string, checked: boolean) {
    setValue(name, checked ? [...current, value] : current.filter((item) => item !== value), { shouldDirty: true })
  }

  function addSkill() {
    const value = skillDraft.trim()
    if (!value) return
    if (skills.includes(value)) {
      notify.warning('That skill is already added.')
      return
    }
    setValue('skills', [...skills, value], { shouldValidate: true })
    setSkillDraft('')
  }

  const submit = handleSubmit(async (values) => {
    setFormError('')
    const payload: JobPayload = {
      title: values.title.trim(),
      job_listings_status: Number(values.job_listings_status),
      priority_status: Number(values.priority_status),
      description: blank(values.description),
      requirements: blank(values.requirements),
      required_qualification: blank(values.required_qualification),
      responsibilities: blank(values.responsibilities),
      benefits: blank(values.benefits),
      salary_min: optionalNumber(values.salary_min),
      salary_max: optionalNumber(values.salary_max),
      salary_type: optionalNumber(values.salary_type),
      salary_unit: optionalNumber(values.salary_unit),
      pay_frequency: optionalNumber(values.pay_frequency),
      experience_level: optionalNumber(values.experience_level),
      quantity: optionalNumber(values.quantity),
      use_company_address: values.use_company_address,
      country_id: values.country_id,
      island_id: values.island_id,
      town_id: values.town_id,
      location: blank(values.location),
      address: blank(values.address),
      latitude: optionalNumber(values.latitude),
      longitude: optionalNumber(values.longitude),
      is_internal_application: values.is_internal_application,
      external_application_url: values.is_internal_application ? null : blank(values.external_application_url),
      published_at: values.published_at || null,
      expired_at: values.expired_at || null,
      industry_ids: values.industry_ids,
      category_ids: values.category_ids,
      type_ids: values.type_ids,
      education_level_ids: values.education_level_ids,
      skills: values.skills,
      ...(id && jobQuery.data ? { updated_at: jobQuery.data.updated_at } : {}),
    }
    try {
      const saved = await save.mutateAsync({ id, payload })
      notify.success(id ? 'Job listing updated.' : 'Job listing created.')
      navigate(jobPath(saved.id), { replace: true })
    } catch (error) {
      const message = applyApiErrors(error, setError, 'Could not save this job listing.')
      setFormError(message)
      notify.error(message)
    }
  })

  return (
    <section>
      <Link className="text-sm font-medium text-accent" to={isEdit && id ? jobPath(id) : ROUTES.JOBS}>Back</Link>
      <PageHeader
        eyebrow="HIRING"
        title={isEdit ? 'Edit job listing' : 'New job listing'}
        description="Title, location, and status are required."
      />
      <form className="space-y-8 rounded-2xl border border-line bg-white p-6 shadow-sm" noValidate onSubmit={submit}>
        {formError ? <Alert>{formError}</Alert> : null}
        {catalog.data?.countries.length === 0 ? <Alert>No locations are seeded yet. Run the catalog seeder before creating a listing.</Alert> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Title" autoFocus error={errors.title?.message} {...register('title')} />
          <SelectField label="Status" error={errors.job_listings_status?.message} {...register('job_listings_status')}>
            <option value={2}>Draft</option>
            <option value={1}>Published</option>
            {isEdit ? <option value={9}>Closed</option> : null}
          </SelectField>
          <SelectField label="Priority" error={errors.priority_status?.message} {...register('priority_status')}>
            <option value={1}>High</option>
            <option value={2}>Normal</option>
            <option value={3}>Low</option>
          </SelectField>
          <TextField label="Quantity" inputMode="numeric" error={errors.quantity?.message} {...register('quantity')} />
          <TextField label="Publish date" type="date" error={errors.published_at?.message} {...register('published_at')} />
          <TextField label="Expiry date" type="date" error={errors.expired_at?.message} {...register('expired_at')} />
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-navy">Content</h2>
          <TextArea label="Description" error={errors.description?.message} {...register('description')} />
          <TextArea label="Requirements" error={errors.requirements?.message} {...register('requirements')} />
          <TextArea label="Required qualification" error={errors.required_qualification?.message} {...register('required_qualification')} />
          <TextArea label="Responsibilities" error={errors.responsibilities?.message} {...register('responsibilities')} />
          <TextArea label="Benefits" error={errors.benefits?.message} {...register('benefits')} />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-navy">Pay</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField label="Pay type" error={errors.salary_type?.message} {...register('salary_type')}>
              <option value="">Not specified</option>
              {salaryTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </SelectField>
            <SelectField label="Experience" error={errors.experience_level?.message} {...register('experience_level')}>
              <option value="">Not specified</option>
              {experienceLevels.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </SelectField>
            <TextField label="Minimum pay" inputMode="decimal" error={errors.salary_min?.message} {...register('salary_min')} />
            <TextField label="Maximum pay" inputMode="decimal" error={errors.salary_max?.message} {...register('salary_max')} />
            <SelectField label="Unit" error={errors.salary_unit?.message} {...register('salary_unit')}>
              <option value="">Not specified</option>
              {salaryUnits.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </SelectField>
            <SelectField label="Pay frequency" error={errors.pay_frequency?.message} {...register('pay_frequency')}>
              <option value="">Not specified</option>
              {payFrequencies.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </SelectField>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-navy">Location</h2>
          <label className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium text-navy">
            <input
              type="checkbox"
              {...addressField}
              onChange={(event) => {
                void addressField.onChange(event)
                copyCompanyAddress(event.target.checked)
              }}
            />
            Use the company address
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField label="Country" value={countryId} error={errors.country_id?.message} {...countryField} onChange={(event) => {
              void countryField.onChange(event)
              setValue('island_id', '')
              setValue('town_id', '')
            }}>
              <option value="">Choose a country</option>
              {(catalog.data?.countries ?? []).map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}
            </SelectField>
            <SelectField label="Region" value={islandId} error={errors.island_id?.message} {...islandField} onChange={(event) => {
              void islandField.onChange(event)
              setValue('town_id', '')
            }}>
              <option value="">Choose a region</option>
              {(islands.data ?? []).map((island) => <option key={island.id} value={island.id}>{island.name}</option>)}
            </SelectField>
            <SelectField label="Town" value={townId} error={errors.town_id?.message} {...register('town_id')}>
              <option value="">Choose a town</option>
              {(towns.data ?? []).map((town) => <option key={town.id} value={town.id}>{town.name}</option>)}
            </SelectField>
            <TextField label="Specific location" error={errors.location?.message} {...register('location')} />
            <TextField label="Address" className="md:col-span-2" error={errors.address?.message} {...register('address')} />
            <TextField label="Latitude" error={errors.latitude?.message} {...register('latitude')} />
            <TextField label="Longitude" error={errors.longitude?.message} {...register('longitude')} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-navy">Classification</h2>
          <CheckGroup label="Industries" options={catalog.data?.industries ?? []} value={industryIds} onToggle={(value, checked) => toggle('industry_ids', industryIds, value, checked)} />
          <CheckGroup label="Categories" options={catalog.data?.categories ?? []} value={categoryIds} onToggle={(value, checked) => toggle('category_ids', categoryIds, value, checked)} />
          <CheckGroup label="Job types" options={catalog.data?.types ?? []} value={typeIds} onToggle={(value, checked) => toggle('type_ids', typeIds, value, checked)} />
          <CheckGroup label="Education" options={catalog.data?.educationLevels ?? []} value={educationIds} onToggle={(value, checked) => toggle('education_level_ids', educationIds, value, checked)} />
          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <TextField label="Skill" value={skillDraft} maxLength={200} onChange={(event) => setSkillDraft(event.target.value)} onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addSkill()
                }
              }} />
              <Button variant="secondary" onClick={addSkill}>Add</Button>
            </div>
            {errors.skills?.message ? <p className="mt-1 text-sm text-danger">{errors.skills.message}</p> : null}
            {skills.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li key={skill}>
                    <button type="button" className="rounded-full bg-canvas px-3 py-1 text-sm text-navy" onClick={() => setValue('skills', skills.filter((item) => item !== skill))}>
                      {skill} ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-navy">Applications</h2>
          <label className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium text-navy">
            <input type="checkbox" {...register('is_internal_application')} />
            Accept applications inside MatchingJobs
          </label>
          {internal ? null : (
            <TextField label="External application URL" error={errors.external_application_url?.message} {...register('external_application_url')} />
          )}
        </section>

        <Button type="submit" disabled={isSubmitting || save.isPending}>{save.isPending ? 'Saving…' : 'Save listing'}</Button>
      </form>
    </section>
  )
}

function toForm(job: JobListing): JobForm {
  return {
    title: job.title,
    job_listings_status: job.job_listings_status,
    priority_status: job.priority_status,
    description: job.description ?? '',
    requirements: job.requirements ?? '',
    required_qualification: job.required_qualification ?? '',
    responsibilities: job.responsibilities ?? '',
    benefits: job.benefits ?? '',
    salary_min: job.salary_min ?? '',
    salary_max: job.salary_max ?? '',
    salary_type: job.salary_type == null ? '' : String(job.salary_type),
    salary_unit: job.salary_unit == null ? '' : String(job.salary_unit),
    pay_frequency: job.pay_frequency == null ? '' : String(job.pay_frequency),
    experience_level: job.experience_level == null ? '' : String(job.experience_level),
    quantity: job.quantity == null ? '' : String(job.quantity),
    use_company_address: job.use_company_address,
    country_id: job.country_id,
    island_id: job.island_id,
    town_id: job.town_id,
    location: job.location ?? '',
    address: job.address ?? '',
    latitude: job.latitude == null ? '' : String(job.latitude),
    longitude: job.longitude == null ? '' : String(job.longitude),
    is_internal_application: job.is_internal_application,
    external_application_url: job.external_application_url ?? '',
    published_at: dateInputValue(job.published_at),
    expired_at: dateInputValue(job.expired_at),
    industry_ids: job.industry_ids,
    category_ids: job.category_ids,
    type_ids: job.type_ids,
    education_level_ids: job.education_level_ids,
    skills: job.skills,
  }
}

function CheckGroup({ label, options, value, onToggle }: { label: string; options: Named[]; value: string[]; onToggle: (id: string, checked: boolean) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-navy">{label}</legend>
      {options.length === 0 ? <p className="mt-1 text-sm text-muted">No options yet.</p> : null}
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option.id} className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm text-ink">
            <input type="checkbox" checked={value.includes(option.id)} onChange={(event) => onToggle(option.id, event.target.checked)} />
            {option.name}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }>(
  function TextArea({ label, error, ...props }, ref) {
    return (
      <label className="block text-sm font-medium text-navy">
        {label}
        <textarea ref={ref} className={cn(controlClass, 'mt-1')} rows={4} {...props} />
        {error ? <span className="mt-1 block text-sm font-normal text-danger">{error}</span> : null}
      </label>
    )
  },
)

function blank(value: string) {
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function optionalNumber(value: string) {
  return value.trim() === '' ? null : Number(value)
}

function bound(value: string, min: number, max: number, path: string, message: string, context: z.RefinementCtx) {
  if (!value.trim()) return
  const number = Number(value)
  if (!Number.isFinite(number) || number < min || number > max) {
    context.addIssue({ code: 'custom', path: [path], message })
  }
}

function todayInput() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}
