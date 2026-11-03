export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
  JOB_SEEKERS: '/job-seekers',
  JOB_SEEKER_NEW: '/job-seekers/new',
  COMPANIES: '/companies',
  COMPANY_NEW: '/companies/new',
} as const

export const jobSeekerPath = (id: string) => `/job-seekers/${id}`
export const jobSeekerEditPath = (id: string) => `/job-seekers/${id}/edit`
export const companyPath = (id: string) => `/companies/${id}`
export const companyEditPath = (id: string) => `/companies/${id}/edit`
export const staffNewPath = (companyId: string) => `/companies/${companyId}/staff/new`
export const staffEditPath = (companyId: string, staffId: string) => `/companies/${companyId}/staff/${staffId}/edit`

export const AUTH_PATHS = [ROUTES.LOGIN]
