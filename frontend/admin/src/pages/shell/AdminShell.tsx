import { LayoutDashboard, Users } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/auth/context'
import { AppShell } from '@shared/ui/AppShell'
import { FALLBACK_NAME } from '@/constants/copy'
import { ROUTES } from '@/constants/routes'

export function AdminShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  if (!user) return null

  const onJobSeekers = location.pathname.startsWith(ROUTES.JOB_SEEKERS)

  return (
    <AppShell
      homeHref={ROUTES.HOME}
      product="Admin"
      navLabel="WORKSPACE"
      note="Manage the MatchingJobs platform"
      items={[
        { to: ROUTES.HOME, label: 'Dashboard', icon: LayoutDashboard, end: true },
        { to: ROUTES.JOB_SEEKERS, label: 'Jobseekers', icon: Users },
      ]}
      headerKicker="ADMIN PORTAL"
      headerTitle={onJobSeekers ? 'Jobseeker management' : 'Dashboard'}
      userName={user.name || user.email || FALLBACK_NAME}
      logoutLabel="Sign out"
      onLogout={() => {
        void logout().finally(() => navigate(ROUTES.LOGIN, { replace: true }))
      }}
    >
      <Outlet />
    </AppShell>
  )
}
