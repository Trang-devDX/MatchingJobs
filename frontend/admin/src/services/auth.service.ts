import { createAuthService } from '@shared/auth/createAuthService'
import { api } from './api'
import { session } from './session'

export const AuthService = createAuthService(api, {
  login: '/admin/login',
  me: '/admin/profile',
  logout: '/admin/logout',
}, () => session.getToken())
