import { STORAGE_KEYS } from '../constants/routes'
import { apiRequest } from './api'

export const AuthService = {
  async login(credentials) {
    const result = await apiRequest('/jobseeker/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    localStorage.setItem(STORAGE_KEYS.TOKEN, result.data.token)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.data.user))
    localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(Date.now() + result.data.expires_in * 60_000))

    return result.data
  },

  async me(token) {
    return (await apiRequest('/jobseeker/me', { token })).data
  },

  async logout() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

    try {
      if (token) {
        await apiRequest('/jobseeker/logout', { method: 'POST', token, body: '{}' })
      }
    } finally {
      this.clearSession()
    }
  },

  async forgotPassword(email) {
    return apiRequest('/jobseeker/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  async resetPassword(data) {
    return apiRequest('/jobseeker/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT)
  },
}
