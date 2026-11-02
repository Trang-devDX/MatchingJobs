import { ApiError } from '@shared/api/errors'
import { api } from './api'

export type JobSeeker = {
  id: string
  user_id: string | null
  name: string | null
  email: string
  status: number
  job_seeking_status: number | null
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  phone_number: string | null
  gender: number | null
  date_of_birth: string | null
  created_at: string | null
}

export type JobSeekerPayload = {
  first_name: string
  middle_name: string | null
  last_name: string | null
  email: string
  password?: string
  phone_number: string | null
  gender: number | null
  date_of_birth: string | null
  job_seeking_status: number | null
  status?: number
}

export const JobSeekerService = {
  async list(search: string, page: number, signal: AbortSignal) {
    const params = new URLSearchParams({ page: String(page), per_page: '10' })
    if (search.trim()) params.set('search', search.trim())
    const result = await api.request<JobSeeker[]>(`/admin/job-seekers?${params}`, { signal })
    if (!result.meta) throw new ApiError('Missing pagination data.', 500)
    return { data: result.data, meta: result.meta }
  },

  async get(id: string, signal: AbortSignal) {
    const result = await api.request<JobSeeker>(`/admin/job-seekers/${id}`, { signal })
    return result.data
  },

  async save(payload: JobSeekerPayload, id?: string) {
    const path = id ? `/admin/job-seekers/${id}` : '/admin/job-seekers'
    const result = await api.request<JobSeeker>(path, { method: 'POST', body: payload })
    return result.data
  },

  async remove(id: string) {
    await api.request<null>(`/admin/job-seekers/${id}`, { method: 'DELETE' })
  },
}
