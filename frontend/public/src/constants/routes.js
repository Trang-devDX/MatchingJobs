export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  APP: '/app',
}

export const STORAGE_KEYS = {
  TOKEN: 'matchingjobs.jobseeker.token',
  USER: 'matchingjobs.jobseeker.user',
  EXPIRES_AT: 'matchingjobs.jobseeker.expiresAt',
}

export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.FORGOT_PASSWORD, ROUTES.RESET_PASSWORD]
