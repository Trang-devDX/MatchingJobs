import { createAuthService } from '@shared/auth/createAuthService'
import { api } from './api'
import { session } from './session'

export const AuthService = createAuthService(api, {
  login: '/jobseeker/login',
  me: '/jobseeker/me',
  logout: '/jobseeker/logout',
  forgotPassword: '/jobseeker/forgot-password',
  resetPassword: '/jobseeker/reset-password',
}, () => session.getToken())
