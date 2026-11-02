import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@shared/auth/AuthProvider'
import { GuestOnly, RequireAuth } from '@shared/auth/guards'
import { AuthLayout } from '@shared/ui/AuthLayout'
import { NotFound } from '@shared/ui/NotFound'
import { guardCopy } from '@/constants/copy'
import { ROUTES } from '@/constants/routes'
import { AuthPage } from '@/pages/auth/AuthPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
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
                <Route
                  path="*"
                  element={
                    <NotFound
                      embedded
                      homeHref={ROUTES.HOME}
                      title="Không tìm thấy trang"
                      body="Đường dẫn này không có trong cổng công ty."
                      action="Về dashboard"
                    />
                  }
                />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />}
    </QueryClientProvider>
  )
}

function CompanyAuthLayout() {
  return (
    <AuthLayout
      homeHref={ROUTES.LOGIN}
      product="Company"
      eyebrow="DÀNH CHO DOANH NGHIỆP"
      title="Tìm người phù hợp để cùng đi tiếp."
      description="Quản lý hành trình tuyển dụng và kết nối đúng ứng viên."
      footnote="Chỉ nhân viên được ủy quyền mới có thể truy cập cổng công ty."
    />
  )
}
