export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  APP: '/app',
  PROFILE: '/app/profile',
  JOBS: '/app/jobs',
  APPLICATIONS: '/app/applications',
} as const

export const jobPath = (id: string) => `/app/jobs/${id}`
export const applicationPath = (id: string) => `/app/applications/${id}`

export const AUTH_PATHS = [ROUTES.LOGIN, ROUTES.FORGOT_PASSWORD, ROUTES.RESET_PASSWORD]
