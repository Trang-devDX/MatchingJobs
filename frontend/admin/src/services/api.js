import { ROUTES, STORAGE_KEYS } from '../constants/routes'

const API_BASE_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:8000/api`

export async function apiRequest(path, { token, ...options } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const result = await response.json()

  if (!response.ok || !result.success) {
    if (response.status === 401 && token) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT)
      window.location.assign(ROUTES.HOME)
    }

    const error = new Error(result.message || 'Yêu cầu không thành công. Vui lòng thử lại.')
    error.status = response.status
    error.errors = result.errors || {}
    throw error
  }

  return result
}
