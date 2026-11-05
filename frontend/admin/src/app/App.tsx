import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@shared/auth/AuthProvider'
import { GuestOnly, RequireAuth } from '@shared/auth/guards'
import { AuthLayout } from '@shared/ui/AuthLayout'
import { NotFound } from '@shared/ui/NotFound'
import { ToastViewport } from '@shared/ui/toast'
import { guardCopy } from '@/constants/copy'
import { ROUTES } from '@/constants/routes'
import { AuthPage } from '@/pages/auth/AuthPage'
import { CompanyDetailPage } from '@/pages/companies/CompanyDetailPage'
import { CompanyFormPage } from '@/pages/companies/CompanyFormPage'
import { CompanyListPage } from '@/pages/companies/CompanyListPage'
import { StaffFormPage } from '@/pages/companies/StaffFormPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { JobSeekerDetailPage } from '@/pages/job-seekers/JobSeekerDetailPage'
import { JobSeekerFormPage } from '@/pages/job-seekers/JobSeekerFormPage'
import { JobSeekerListPage } from '@/pages/job-seekers/JobSeekerListPage'
import { AdminShell } from '@/pages/shell/AdminShell'
import { AuthService } from '@/services/auth.service'
import { session } from '@/services/session'
import { queryClient } from './queryClient'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider
          session={session}
          loginPath={ROUTES.LOGIN}
          me={AuthService.me}
          login={AuthService.login}
          logout={AuthService.logout}
        >
          <Routes>
            <Route element={<GuestOnly homePath={ROUTES.HOME} copy={guardCopy} />}>
              <Route
                element={
                  <AuthLayout
                    homeHref={ROUTES.LOGIN}
                    product="Admin"
                    eyebrow="ADMIN PORTAL"
                    title="Run the platform with a clear view."
                    description="Sign in to manage accounts and hiring activity."
                    footnote="This area is for authorized MatchingJobs administrators only."
                  />
                }
              >
                <Route path={ROUTES.LOGIN} element={<AuthPage />} />
              </Route>
            </Route>
            <Route element={<RequireAuth loginPath={ROUTES.LOGIN} copy={guardCopy} />}>
              <Route element={<AdminShell />}>
                <Route index element={<DashboardPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="companies" element={<CompanyListPage />} />
                <Route path="companies/new" element={<CompanyFormPage />} />
                <Route path="companies/:id" element={<CompanyDetailPage />} />
                <Route path="companies/:id/edit" element={<CompanyFormPage />} />
                <Route path="companies/:companyId/staff/new" element={<StaffFormPage />} />
                <Route path="companies/:companyId/staff/:staffId/edit" element={<StaffFormPage />} />
                <Route path="job-seekers" element={<JobSeekerListPage />} />
                <Route path="job-seekers/new" element={<JobSeekerFormPage />} />
                <Route path="job-seekers/:id" element={<JobSeekerDetailPage />} />
                <Route path="job-seekers/:id/edit" element={<JobSeekerFormPage />} />
                <Route
                  path="*"
                  element={
                    <NotFound
                      embedded
                      homeHref={ROUTES.HOME}
                      title="Page not found"
                      body="This path is not part of the admin portal."
                      action="Back to dashboard"
                    />
                  }
                />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <ToastViewport />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />}
    </QueryClientProvider>
  )
}
