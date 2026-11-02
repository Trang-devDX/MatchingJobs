import { createAuthService } from '@shared/auth/createAuthService'
import { api } from './api'
import { session } from './session'

export const AuthService = createAuthService(api, {
  login: '/company/login',
  me: '/company/me',
  logout: '/company/logout',
  forgotPassword: '/company/forgot-password',
  resetPassword: '/company/reset-password',
}, () => session.getToken())
