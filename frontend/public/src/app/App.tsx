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
import { DashboardPage } from '@/pages/Dashboard/DashboardPage'
import { HomePage } from '@/pages/home/HomePage'
import { JobSeekerShell } from '@/pages/shell/JobSeekerShell'
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
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route element={<GuestOnly homePath={ROUTES.APP} copy={guardCopy} />}>
              <Route element={<PublicAuthLayout />}>
                <Route path={ROUTES.LOGIN} element={<AuthPage mode="login" />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<AuthPage mode="forgot" />} />
              </Route>
            </Route>
            <Route element={<PublicAuthLayout />}>
              <Route path={ROUTES.RESET_PASSWORD} element={<AuthPage mode="reset" />} />
            </Route>
            <Route element={<RequireAuth loginPath={ROUTES.LOGIN} copy={guardCopy} />}>
              <Route element={<JobSeekerShell />}>
                <Route path={ROUTES.APP} element={<DashboardPage />} />
              </Route>
            </Route>
            <Route
              path="*"
              element={
                <NotFound
                  homeHref={ROUTES.HOME}
                  title="Page not found"
                  body="This path is not part of the jobseeker portal."
                  action="Back to home"
                />
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <ToastViewport />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />}
    </QueryClientProvider>
  )
}

function PublicAuthLayout() {
  return (
    <AuthLayout
      homeHref={ROUTES.HOME}
      product="Jobseeker"
      eyebrow="FOR JOBSEEKERS"
      title="Good work starts with the right connection."
      description="Sign in to continue your career journey."
      footnote="This portal is for MatchingJobs jobseekers."
    />
  )
}
