import { createContext, useContext } from 'react'
import type { SessionUser } from './session'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'error'

export type AuthContextValue = {
  user: SessionUser | null
  status: AuthStatus
  login: (credentials: { email: string; password: string }) => Promise<SessionUser>
  logout: () => Promise<void>
  retry: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
