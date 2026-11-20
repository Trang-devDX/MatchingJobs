import type { PageMeta } from '@shared/api/types'
import { api } from './api'

export type CompanyApplication = {
  id: string
  job_listing_id: string
  job_title: string | null
  job_seeker_name: string | null
  job_seeker_email: string | null
  job_application_status: number
  status_label: string
  cover_letter: string | null
  is_viewed: boolean
  applied_at: string | null
  updated_at: string | null
}

const STATUSES = [
  { value: 2, label: 'Reviewed' },
  { value: 3, label: 'Shortlisted' },
  { value: 4, label: 'Interviewed' },
  { value: 5, label: 'Offered' },
  { value: 6, label: 'Rejected' },
  { value: 7, label: 'Withdrawn' },
  { value: 8, label: 'Hired' },
]

export const applicationStatuses = STATUSES

export const ApplicationService = {
  async list(page: number, signal?: AbortSignal) {
    const result = await api.request<CompanyApplication[]>(`/company/job-applications?page=${page}`, { signal })
    return { applications: result.data, meta: result.meta as PageMeta }
  },

  async get(id: string, signal?: AbortSignal) {
    const result = await api.request<CompanyApplication>(`/company/job-applications/${id}`, { signal })
    return result.data
  },

  async updateStatus(id: string, status: number, updatedAt: string) {
    const result = await api.request<CompanyApplication>(`/company/job-applications/${id}`, {
      method: 'POST',
      body: { job_application_status: status, updated_at: updatedAt },
    })
    return result.data
  },
}
