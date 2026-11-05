import { CircleUser, LayoutDashboard } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/auth/context'
import { AppShell } from '@shared/ui/AppShell'
import { FALLBACK_NAME } from '@/constants/copy'
import { ROUTES } from '@/constants/routes'

export function JobSeekerShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  if (!user) return null

  const name = user.name || FALLBACK_NAME
  const headerTitle = location.pathname.startsWith(ROUTES.PROFILE)
    ? 'Profile'
    : location.pathname.startsWith(ROUTES.APP)
      ? 'Dashboard'
      : 'MatchingJobs'

  return (
    <AppShell
      homeHref={ROUTES.HOME}
      product="Jobseeker"
      navLabel="WORKSPACE"
      note="Jobseeker portal"
      items={[
        { to: ROUTES.APP, label: 'Dashboard', icon: LayoutDashboard, end: true },
        { to: ROUTES.PROFILE, label: 'Profile', icon: CircleUser },
      ]}
      headerKicker="JOBSEEKER PORTAL"
      headerTitle={headerTitle}
      userName={name}
      avatarUrl={user.avatar_url}
      logoutLabel="Sign out"
      onLogout={() => {
        void logout().finally(() => navigate(ROUTES.HOME, { replace: true }))
      }}
    >
      <Outlet />
    </AppShell>
  )
}
