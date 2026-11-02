export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  APP: '/app',
} as const

export const AUTH_PATHS = [ROUTES.LOGIN, ROUTES.FORGOT_PASSWORD, ROUTES.RESET_PASSWORD]
