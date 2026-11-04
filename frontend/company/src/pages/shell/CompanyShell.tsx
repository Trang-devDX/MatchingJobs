import { Briefcase, LayoutDashboard } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/auth/context'
import { AppShell } from '@shared/ui/AppShell'
import { FALLBACK_NAME } from '@/constants/copy'
import { ROUTES } from '@/constants/routes'

export function CompanyShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  if (!user) return null

  const headerTitle = location.pathname.startsWith(ROUTES.JOBS) ? 'Job listings' : 'Dashboard'

  return (
    <AppShell
      homeHref={ROUTES.HOME}
      product="Company"
      navLabel="WORKSPACE"
      note="Company portal"
      items={[
        { to: ROUTES.HOME, label: 'Dashboard', icon: LayoutDashboard, end: true },
        { to: ROUTES.JOBS, label: 'Job listings', icon: Briefcase },
      ]}
      headerKicker="COMPANY PORTAL"
      headerTitle={headerTitle}
      userName={user.name || FALLBACK_NAME}
      logoutLabel="Sign out"
      onLogout={() => {
        void logout().finally(() => navigate(ROUTES.LOGIN, { replace: true }))
      }}
    >
      <Outlet />
    </AppShell>
  )
}
