import { api } from './api'

export type AdminDashboard = {
  total_job_seekers: number
  active_job_seekers: number
  total_jobs: number
  active_jobs: number
  total_companies: number
}

export const DashboardService = {
  async get(signal: AbortSignal) {
    const result = await api.request<AdminDashboard>('/admin/dashboard', { signal })
    return result.data
  },
}
