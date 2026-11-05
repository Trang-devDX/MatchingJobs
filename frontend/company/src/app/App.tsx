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
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { JobDetailPage } from '@/pages/jobs/JobDetailPage'
import { JobFormPage } from '@/pages/jobs/JobFormPage'
import { JobListPage } from '@/pages/jobs/JobListPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { CompanyShell } from '@/pages/shell/CompanyShell'
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
              <Route element={<CompanyAuthLayout />}>
                <Route path={ROUTES.LOGIN} element={<AuthPage mode="login" />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<AuthPage mode="forgot" />} />
              </Route>
            </Route>
            <Route element={<CompanyAuthLayout />}>
              <Route path={ROUTES.RESET_PASSWORD} element={<AuthPage mode="reset" />} />
            </Route>
            <Route element={<RequireAuth loginPath={ROUTES.LOGIN} copy={guardCopy} />}>
              <Route element={<CompanyShell />}>
                <Route index element={<DashboardPage />} />
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                <Route path="jobs" element={<JobListPage />} />
                <Route path="jobs/new" element={<JobFormPage />} />
                <Route path="jobs/:id" element={<JobDetailPage />} />
                <Route path="jobs/:id/edit" element={<JobFormPage />} />
                <Route
                  path="*"
                  element={
                    <NotFound
                      embedded
                      homeHref={ROUTES.HOME}
                      title="Page not found"
                      body="This path is not part of the company portal."
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

function CompanyAuthLayout() {
  return (
    <AuthLayout
      homeHref={ROUTES.LOGIN}
      product="Company"
      eyebrow="FOR EMPLOYERS"
      title="Find the right people to move forward with."
      description="Manage hiring and connect with the right candidates."
      footnote="Only authorized staff can access the company portal."
    />
  )
}
