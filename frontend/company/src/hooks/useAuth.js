import { useEffect, useState } from 'react'
import { ROUTES, STORAGE_KEYS } from '../constants/routes'
import { AuthService } from '../services/auth.service'

export function useAuthSession(enabled) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(enabled)

  useEffect(() => {
    if (!enabled) return

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

    if (!token) {
      const redirect = encodeURIComponent(`${window.location.pathname}${window.location.search}`)
      window.location.replace(`${ROUTES.LOGIN}?redirect=${redirect}`)
      return
    }

    AuthService.me(token)
      .then((profile) => {
        setUser(profile)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile))
      })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [enabled])

  useEffect(() => {
    const expiresAt = Number(localStorage.getItem(STORAGE_KEYS.EXPIRES_AT))
    if (!user || !expiresAt) return undefined

    const timer = window.setTimeout(() => {
      AuthService.clearSession()
      window.location.assign(ROUTES.LOGIN)
    }, Math.max(0, expiresAt - Date.now()))

    return () => window.clearTimeout(timer)
  }, [user])

  return { user, checking }
}
