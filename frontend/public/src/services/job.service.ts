import type { PageMeta } from '@shared/api/types'
import { api } from './api'

export type PublicJob = {
  id: string
  title: string
  company_name: string | null
  location: string | null
  salary_min: string | null
  salary_max: string | null
  is_internal_application: boolean
  published_at: string | null
  expired_at: string | null
  applied: boolean
  description?: string | null
  requirements?: string | null
  responsibilities?: string | null
  benefits?: string | null
  external_application_url?: string | null
  country?: { id: string; name: string } | null
  island?: { id: string; name: string } | null
  town?: { id: string; name: string } | null
  application?: JobApplication | null
}

export type JobApplication = {
  id: string
  job_listing_id: string
  job_title: string | null
  company_name: string | null
  job_application_status: number
  status_label: string
  cover_letter: string | null
  applied_at: string | null
  updated_at: string | null
}

export const JobService = {
  async list(search: string, page: number, signal?: AbortSignal) {
    const params = new URLSearchParams({ page: String(page) })
    if (search) params.set('search', search)
    const result = await api.request<PublicJob[]>(`/jobseeker/jobs?${params}`, { signal })
    return { jobs: result.data, meta: result.meta as PageMeta }
  },

  async get(id: string, signal?: AbortSignal) {
    const result = await api.request<PublicJob>(`/jobseeker/jobs/${id}`, { signal })
    return result.data
  },

  async apply(id: string, coverLetter: string) {
    const result = await api.request<JobApplication>(`/jobseeker/jobs/${id}/applications`, {
      method: 'POST',
      body: { cover_letter: coverLetter || null },
    })
    return result.data
  },

  async applications(page: number, signal?: AbortSignal) {
    const result = await api.request<JobApplication[]>(`/jobseeker/applications?page=${page}`, { signal })
    return { applications: result.data, meta: result.meta as PageMeta }
  },

  async application(id: string, signal?: AbortSignal) {
    const result = await api.request<JobApplication>(`/jobseeker/applications/${id}`, { signal })
    return result.data
  },
}
