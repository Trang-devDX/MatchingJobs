import { apiRequest } from './api'
import { STORAGE_KEYS } from '../constants/routes'

const token = () => localStorage.getItem(STORAGE_KEYS.TOKEN)

export const JobSeekerService = {
  async list(search = '', page = 1) {
    const params = new URLSearchParams({ page: String(page), per_page: '10' })
    if (search.trim()) params.set('search', search.trim())
    const { data, meta } = await apiRequest(`/admin/job-seekers?${params}`, { token: token() })
    return { data, meta }
  },
  async get(id) {
    return (await apiRequest(`/admin/job-seekers/${id}`, { token: token() })).data
  },
  async save(data, id) {
    const path = id ? `/admin/job-seekers/${id}` : '/admin/job-seekers'
    return (await apiRequest(path, {
      token: token(),
      method: 'POST',
      body: JSON.stringify(data),
    })).data
  },
  async remove(id) {
    return apiRequest(`/admin/job-seekers/${id}`, { token: token(), method: 'DELETE' })
  },
  async dashboard() {
    return (await apiRequest('/admin/dashboard', { token: token() })).data
  },
}
