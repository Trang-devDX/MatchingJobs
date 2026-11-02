import { api } from './api'

export type JobSeekerDashboard = {
  total_applications: number
  pending_applications: number
  saved_jobs: number
  followed_companies: number
}

export const DashboardService = {
  async get(signal: AbortSignal) {
    const result = await api.request<JobSeekerDashboard>('/jobseeker/dashboard', { signal })
    return result.data
  },
}
