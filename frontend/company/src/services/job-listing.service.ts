import { api } from './api'
import type { PageMeta } from '@shared/api/types'

export type Named = { id: string; name: string }

export type CompanyPlace = {
  id: string
  name: string
  address: string | null
  specific_location: string | null
  latitude: string | number | null
  longitude: string | number | null
  country: Named | null
  island: Named | null
  town: Named | null
}

export type JobSummary = {
  id: string
  title: string
  job_listings_status: number
  priority_status: number
  salary_min: string | null
  salary_max: string | null
  salary_type: number | null
  published_at: string | null
  expired_at: string | null
  created_at: string | null
  updated_at: string
  has_applications: boolean
  can_edit: boolean
  can_close: boolean
  job_types: Named[]
}

export type JobListing = JobSummary & {
  description: string | null
  requirements: string | null
  required_qualification: string | null
  responsibilities: string | null
  benefits: string | null
  experience_level: number | null
  salary_unit: number | null
  pay_frequency: number | null
  quantity: number | null
  use_company_address: boolean
  country_id: string
  island_id: string
  town_id: string
  country: Named | null
  island: Named | null
  town: Named | null
  location: string | null
  address: string | null
  latitude: string | number | null
  longitude: string | number | null
  is_internal_application: boolean
  external_application_url: string | null
  industry_ids: string[]
  category_ids: string[]
  type_ids: string[]
  education_level_ids: string[]
  industries: Named[]
  categories: Named[]
  education_levels: Named[]
  skills: string[]
}

export type JobPayload = {
  title: string
  job_listings_status: number
  priority_status: number
  description: string | null
  requirements: string | null
  required_qualification: string | null
  responsibilities: string | null
  benefits: string | null
  salary_min: number | null
  salary_max: number | null
  salary_type: number | null
  salary_unit: number | null
  pay_frequency: number | null
  experience_level: number | null
  quantity: number | null
  use_company_address: boolean
  country_id: string
  island_id: string
  town_id: string
  location: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  is_internal_application: boolean
  external_application_url: string | null
  published_at: string | null
  expired_at: string | null
  industry_ids: string[]
  category_ids: string[]
  type_ids: string[]
  education_level_ids: string[]
  skills: string[]
  updated_at?: string
}

export type JobFilters = {
  search: string
  status: string
  typeId: string
  dateFrom: string
  dateEnd: string
  page: number
}

const STATUS_LABELS: Record<number, string> = { 1: 'Published', 2: 'Draft', 9: 'Closed' }
const PRIORITY_LABELS: Record<number, string> = { 1: 'High', 2: 'Normal', 3: 'Low' }

export function statusLabel(status: number) {
  return STATUS_LABELS[status] ?? 'Unknown'
}

export function priorityLabel(priority: number) {
  return PRIORITY_LABELS[priority] ?? 'Normal'
}

export function formatDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)
}

export function dateInputValue(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

function query(filters: JobFilters) {
  const params = new URLSearchParams({ page: String(filters.page) })
  if (filters.search) params.set('search', filters.search)
  if (filters.status) params.set('job_listings_status', filters.status)
  if (filters.typeId) params.set('type_id', filters.typeId)
  if (filters.dateFrom) params.set('date_from', filters.dateFrom)
  if (filters.dateEnd) params.set('date_end', filters.dateEnd)
  return params.toString()
}

export const JobListingService = {
  async list(filters: JobFilters, signal: AbortSignal) {
    const result = await api.request<JobSummary[]>(`/company/job-listings?${query(filters)}`, { signal })
    return { jobs: result.data, meta: result.meta as PageMeta }
  },

  async get(id: string, signal: AbortSignal) {
    const result = await api.request<JobListing>(`/company/job-listings/${id}`, { signal })
    return result.data
  },

  async save(payload: JobPayload, id?: string) {
    const result = await api.request<JobListing>(id ? `/company/job-listings/${id}` : '/company/job-listings', {
      method: 'POST',
      body: payload,
    })
    return result.data
  },

  async close(id: string, updatedAt: string) {
    const result = await api.request<JobListing>(`/company/job-listings/${id}`, {
      method: 'POST',
      body: { job_listings_status: 9, updated_at: updatedAt },
    })
    return result.data
  },

  async remove(id: string) {
    await api.request(`/company/job-listings/${id}`, { method: 'DELETE' })
  },

  async names(path: string, signal?: AbortSignal) {
    const result = await api.request<Named[]>(path, { signal })
    return result.data
  },

  async company(signal?: AbortSignal) {
    const result = await api.request<{ company: CompanyPlace | null }>('/company/me', { signal })
    return result.data.company
  },
}
