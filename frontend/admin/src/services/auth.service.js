import { STORAGE_KEYS } from '../constants/routes'
import { apiRequest } from './api'

export const AuthService = {
  async login(credentials) {
    const result = await apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    localStorage.setItem(STORAGE_KEYS.TOKEN, result.data.token)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.data.user))
    localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(Date.now() + result.data.expires_in * 60_000))

    return result.data
  },

  async profile(token) {
    return (await apiRequest('/admin/profile', { token })).data
  },

  async logout() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

    try {
      if (token) {
        await apiRequest('/admin/logout', { method: 'POST', token, body: '{}' })
      }
    } finally {
      this.clearSession()
    }
  },

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT)
  },
}
