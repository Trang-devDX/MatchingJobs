import { createApiClient, resolveApiBaseUrl } from '@shared/api/client'
import { redirectToLogin } from '@shared/auth/redirect'
import { ROUTES } from '@/constants/routes'
import { session } from './session'

export const api = createApiClient({
  baseUrl: resolveApiBaseUrl(),
  getToken: () => session.getToken(),
  onUnauthorized: () => {
    session.clear()
    redirectToLogin(ROUTES.LOGIN)
  },
})
