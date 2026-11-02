import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { LoginResult } from '../api/types'
import { AuthContext, type AuthStatus } from './context'
import { toSessionUser, type SessionStore, type SessionUser } from './session'

const PROFILE_KEY = ['auth', 'profile'] as const

type AuthProviderProps = {
  session: SessionStore
  loginPath: string
  me: (signal: AbortSignal) => Promise<SessionUser>
  login: (credentials: { email: string; password: string }) => Promise<LoginResult>
  logout: () => Promise<void>
  children: ReactNode
}

export function AuthProvider({ session, loginPath, me, login: signIn, logout: signOut, children }: AuthProviderProps) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState(() => session.getToken())

  const profile = useQuery({
    queryKey: PROFILE_KEY,
    queryFn: ({ signal }) => me(signal),
    enabled: Boolean(token),
    retry: false,
    staleTime: 5 * 60_000,
  })

  useEffect(() => {
    const expiresAt = session.getExpiresAt()
    if (!token || !expiresAt) return undefined

    const timer = window.setTimeout(() => {
      session.clear()
      queryClient.clear()
      window.location.assign(loginPath)
    }, Math.max(0, expiresAt - Date.now()))

    return () => window.clearTimeout(timer)
  }, [token, session, loginPath, queryClient])

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    const result = await signIn(credentials)
    const user = toSessionUser(result.user)
    session.save({ token: result.token, user, expiresInMinutes: result.expires_in })
    queryClient.setQueryData(PROFILE_KEY, user)
    setToken(result.token)
    return user
  }, [signIn, session, queryClient])

  const logout = useCallback(async () => {
    try {
      await signOut()
    } finally {
      session.clear()
      setToken(null)
      queryClient.clear()
    }
  }, [signOut, session, queryClient])

  const status: AuthStatus = !token
    ? 'anonymous'
    : profile.isError
      ? 'error'
      : profile.data
        ? 'authenticated'
        : 'loading'

  const value = {
    user: token ? (profile.data ?? null) : null,
    status,
    login,
    logout,
    retry: () => {
      void profile.refetch()
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
