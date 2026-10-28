import { useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../constants/routes'
import { AuthService } from '../services/auth.service'

export function useAuth() {
  const [administrator, setAdministrator] = useState(null)
  const [checking, setChecking] = useState(Boolean(localStorage.getItem(STORAGE_KEYS.TOKEN)))

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (!token) return

    AuthService.profile(token)
      .then((profile) => {
        setAdministrator(profile)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile))
      })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  useEffect(() => {
    const expiresAt = Number(localStorage.getItem(STORAGE_KEYS.EXPIRES_AT))
    if (!administrator || !expiresAt) return undefined

    const timer = window.setTimeout(() => {
      AuthService.clearSession()
      setAdministrator(null)
    }, Math.max(0, expiresAt - Date.now()))

    return () => window.clearTimeout(timer)
  }, [administrator])

  async function login(credentials) {
    const result = await AuthService.login(credentials)
    setAdministrator(result.user)
  }

  async function logout() {
    try {
      await AuthService.logout()
    } finally {
      setAdministrator(null)
    }
  }

  return { administrator, checking, login, logout }
}
