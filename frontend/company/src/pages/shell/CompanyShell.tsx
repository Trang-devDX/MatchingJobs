import { LayoutDashboard } from 'lucide-react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/auth/context'
import { AppShell } from '@shared/ui/AppShell'
import { FALLBACK_NAME } from '@/constants/copy'
import { ROUTES } from '@/constants/routes'

export function CompanyShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  if (!user) return null

  return (
    <AppShell
      homeHref={ROUTES.HOME}
      product="Company"
      navLabel="WORKSPACE"
      note="Company portal"
      items={[{ to: ROUTES.HOME, label: 'Dashboard', icon: LayoutDashboard, end: true }]}
      headerKicker="COMPANY PORTAL"
      headerTitle="Dashboard"
      userName={user.name || FALLBACK_NAME}
      logoutLabel="Đăng xuất"
      onLogout={() => {
        void logout().finally(() => navigate(ROUTES.LOGIN, { replace: true }))
      }}
    >
      <Outlet />
    </AppShell>
  )
}
