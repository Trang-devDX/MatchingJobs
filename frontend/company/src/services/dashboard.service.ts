import { api } from './api'

export type CompanyDashboard = {
  total_jobs: number
  published_jobs: number
  total_applications: number
  pending_applications: number
}

export const DashboardService = {
  async get(signal: AbortSignal) {
    const result = await api.request<CompanyDashboard>('/company/dashboard', { signal })
    return result.data
  },
}
