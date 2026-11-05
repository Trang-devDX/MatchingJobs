export type SessionUser = {
  id: string
  name: string | null
  email: string
  avatar_url: string | null
}

export type SessionKeys = {
  token: string
  user: string
  expiresAt: string
}

export function portalStorageKeys(portal: 'jobseeker' | 'company' | 'admin'): SessionKeys {
  return {
    token: `matchingjobs.${portal}.token`,
    user: `matchingjobs.${portal}.user`,
    expiresAt: `matchingjobs.${portal}.expiresAt`,
  }
}

export function toSessionUser(user: {
  id: string | number
  name?: string | null
  email: string
  avatar_url?: string | null
}): SessionUser {
  return {
    id: String(user.id),
    name: user.name?.trim() ? user.name : null,
    email: user.email,
    avatar_url: user.avatar_url || null,
  }
}

export function createSessionStore(keys: SessionKeys) {
  return {
    getToken() {
      return localStorage.getItem(keys.token)
    },
    getExpiresAt() {
      const raw = localStorage.getItem(keys.expiresAt)
      if (!raw) return null
      const value = Number(raw)
      return Number.isFinite(value) ? value : null
    },
    save(session: { token: string; user: SessionUser; expiresInMinutes: number }) {
      localStorage.setItem(keys.token, session.token)
      localStorage.setItem(keys.user, JSON.stringify(session.user))
      if (Number.isFinite(session.expiresInMinutes) && session.expiresInMinutes > 0) {
        localStorage.setItem(keys.expiresAt, String(Date.now() + session.expiresInMinutes * 60_000))
      } else {
        localStorage.removeItem(keys.expiresAt)
      }
    },
    clear() {
      localStorage.removeItem(keys.token)
      localStorage.removeItem(keys.user)
      localStorage.removeItem(keys.expiresAt)
    },
  }
}

export type SessionStore = ReturnType<typeof createSessionStore>
