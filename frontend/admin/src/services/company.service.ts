import { ApiError } from '@shared/api/errors'
import { api } from './api'

export type Country = { id: string; name: string }

export type Company = {
  id: string
  name: string
  status: number
  email: string | null
  phone_number: string | null
  website_url: string | null
  description: string | null
  country_id: string
  country_name: string | null
  address: string | null
  logo_url: string | null
  created_at: string | null
}

export type CompanyPayload = {
  name: string
  status: number
  email: string | null
  phone_number: string | null
  website_url: string | null
  description: string | null
  country_id: string
  address: string | null
  logo: File | null
  remove_logo?: boolean
}

export type Staff = {
  id: string
  company_id: string
  user_id: string | null
  is_root: boolean
  name: string | null
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  email: string
  phone_number: string | null
  position: string | null
  status: number
  avatar_url: string | null
  created_at: string | null
}

export type StaffPayload = {
  first_name: string
  middle_name: string | null
  last_name: string
  email: string
  password?: string
  phone_number: string | null
  position: string | null
  status: number
  is_root: boolean
  avatar: File | null
  remove_avatar?: boolean
}

function textForm(entries: Record<string, string | number | boolean | null | undefined>, file?: { key: string; value: File | null }) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(entries)) {
    if (typeof value === 'boolean') formData.append(key, value ? '1' : '0')
    else if (value !== null && value !== undefined && value !== '') formData.append(key, String(value))
  }
  if (file?.value) formData.append(file.key, file.value)
  return formData
}

export const CompanyService = {
  async countries(signal: AbortSignal) {
    const result = await api.request<Country[]>('/admin/countries', { signal })
    return result.data
  },

  async list(search: string, page: number, signal: AbortSignal) {
    const params = new URLSearchParams({ page: String(page), per_page: '10' })
    if (search.trim()) params.set('search', search.trim())
    const result = await api.request<Company[]>(`/admin/companies?${params}`, { signal })
    if (!result.meta) throw new ApiError('Missing pagination data.', 500)
    return { data: result.data, meta: result.meta }
  },

  async get(id: string, signal: AbortSignal) {
    const result = await api.request<Company>(`/admin/companies/${id}`, { signal })
    return result.data
  },

  async save(payload: CompanyPayload, id?: string) {
    const formData = textForm({
      name: payload.name,
      status: payload.status,
      email: payload.email,
      phone_number: payload.phone_number,
      website_url: payload.website_url,
      description: payload.description,
      country_id: payload.country_id,
      address: payload.address,
      remove_logo: id ? payload.remove_logo : undefined,
    }, { key: 'logo', value: payload.logo })
    const path = id ? `/admin/companies/${id}` : '/admin/companies'
    const result = await api.request<Company>(path, { method: 'POST', formData })
    return result.data
  },

  async remove(id: string) {
    await api.request<null>(`/admin/companies/${id}`, { method: 'DELETE' })
  },
}

export const StaffService = {
  async list(companyId: string, search: string, page: number, signal: AbortSignal) {
    const params = new URLSearchParams({ page: String(page), per_page: '10' })
    if (search.trim()) params.set('search', search.trim())
    const result = await api.request<Staff[]>(`/admin/companies/${companyId}/staffs?${params}`, { signal })
    if (!result.meta) throw new ApiError('Missing pagination data.', 500)
    return { data: result.data, meta: result.meta }
  },

  async get(companyId: string, staffId: string, signal: AbortSignal) {
    const result = await api.request<Staff>(`/admin/companies/${companyId}/staffs/${staffId}`, { signal })
    return result.data
  },

  async save(companyId: string, payload: StaffPayload, staffId?: string) {
    const formData = textForm({
      first_name: payload.first_name,
      middle_name: payload.middle_name,
      last_name: payload.last_name,
      email: payload.email,
      password: payload.password,
      phone_number: payload.phone_number,
      position: payload.position,
      status: payload.status,
      is_root: payload.is_root,
      remove_avatar: staffId ? payload.remove_avatar : undefined,
    }, { key: 'avatar', value: payload.avatar })
    const path = staffId
      ? `/admin/companies/${companyId}/staffs/${staffId}`
      : `/admin/companies/${companyId}/staffs`
    const result = await api.request<Staff>(path, { method: 'POST', formData })
    return result.data
  },

  async remove(companyId: string, staffId: string) {
    await api.request<null>(`/admin/companies/${companyId}/staffs/${staffId}`, { method: 'DELETE' })
  },
}
