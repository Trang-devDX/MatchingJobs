export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  JOBS: '/jobs',
  JOB_NEW: '/jobs/new',
  APPLICATIONS: '/applications',
  PROFILE: '/profile',
} as const

export const applicationPath = (id: string) => `/applications/${id}`

export const jobPath = (id: string) => `/jobs/${id}`
export const jobEditPath = (id: string) => `/jobs/${id}/edit`

export const AUTH_PATHS = [ROUTES.LOGIN, ROUTES.FORGOT_PASSWORD, ROUTES.RESET_PASSWORD]
