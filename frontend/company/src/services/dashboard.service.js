import { STORAGE_KEYS } from '../constants/routes'
import { apiRequest } from './api'

export const DashboardService = {
  async get() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    return (await apiRequest('/company/dashboard', { token })).data
  },
}
