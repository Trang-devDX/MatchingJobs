export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
}

export const STORAGE_KEYS = {
  TOKEN: 'matchingjobs.company.token',
  USER: 'matchingjobs.company.user',
  EXPIRES_AT: 'matchingjobs.company.expiresAt',
}

export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.FORGOT_PASSWORD, ROUTES.RESET_PASSWORD]
