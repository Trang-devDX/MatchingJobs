import { z } from 'zod'
import type { JobSeeker, JobSeekerPayload } from '@/services/job-seeker.service'

const genderValues = ['', '1', '2', '9'] as const
const seekingValues = ['', '1', '2'] as const
const statusValues = ['1', '9'] as const

export const jobSeekerSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required.'),
  middle_name: z.string(),
  last_name: z.string(),
  email: z.string().trim().email('Enter a valid email.'),
  password: z.string(),
  phone_number: z.string(),
  gender: z.enum(genderValues),
  date_of_birth: z.string(),
  job_seeking_status: z.enum(seekingValues),
  status: z.enum(statusValues),
})

export type JobSeekerFormValues = z.infer<typeof jobSeekerSchema>

export const emptyJobSeekerForm: JobSeekerFormValues = {
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  password: '',
  phone_number: '',
  gender: '',
  date_of_birth: '',
  job_seeking_status: '',
  status: '1',
}

export function buildJobSeekerSchema(isEdit: boolean) {
  return jobSeekerSchema.superRefine((values, context) => {
    const tooShort = values.password.length > 0 && values.password.length < 8
    if ((!isEdit && values.password.length < 8) || (isEdit && tooShort)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'Password must be at least 8 characters.',
      })
    }
  })
}

export function toFormValues(jobSeeker: JobSeeker): JobSeekerFormValues {
  return {
    first_name: jobSeeker.first_name ?? '',
    middle_name: jobSeeker.middle_name ?? '',
    last_name: jobSeeker.last_name ?? '',
    email: jobSeeker.email,
    password: '',
    phone_number: jobSeeker.phone_number ?? '',
    gender: jobSeeker.gender === 1 || jobSeeker.gender === 2 || jobSeeker.gender === 9 ? String(jobSeeker.gender) as JobSeekerFormValues['gender'] : '',
    date_of_birth: jobSeeker.date_of_birth ? jobSeeker.date_of_birth.slice(0, 10) : '',
    job_seeking_status: jobSeeker.job_seeking_status === 1 || jobSeeker.job_seeking_status === 2
      ? String(jobSeeker.job_seeking_status) as JobSeekerFormValues['job_seeking_status']
      : '',
    status: Number(jobSeeker.status) === 9 ? '9' : '1',
  }
}

export function toPayload(values: JobSeekerFormValues, isEdit: boolean): JobSeekerPayload {
  const payload: JobSeekerPayload = {
    first_name: values.first_name,
    middle_name: values.middle_name || null,
    last_name: values.last_name || null,
    email: values.email,
    phone_number: values.phone_number || null,
    gender: values.gender ? Number(values.gender) : null,
    date_of_birth: values.date_of_birth || null,
    job_seeking_status: values.job_seeking_status ? Number(values.job_seeking_status) : null,
  }
  if (values.password) payload.password = values.password
  if (isEdit) payload.status = Number(values.status)
  return payload
}
