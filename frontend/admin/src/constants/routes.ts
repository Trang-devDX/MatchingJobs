export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  JOB_SEEKERS: '/job-seekers',
  JOB_SEEKER_NEW: '/job-seekers/new',
} as const

export const jobSeekerPath = (id: string) => `/job-seekers/${id}`
export const jobSeekerEditPath = (id: string) => `/job-seekers/${id}/edit`

export const AUTH_PATHS = [ROUTES.LOGIN]
