import { Building2, CircleUser, LayoutDashboard, Users } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/auth/context'
import { AppShell } from '@shared/ui/AppShell'
import { FALLBACK_NAME } from '@/constants/copy'
import { ROUTES } from '@/constants/routes'
import { api } from '@/services/api'

export function AdminShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  if (!user) return null

  const headerTitle = location.pathname.startsWith(ROUTES.COMPANIES)
    ? 'Companies'
    : location.pathname.startsWith(ROUTES.PROFILE)
      ? 'Profile'
      : location.pathname.startsWith(ROUTES.JOB_SEEKERS)
        ? 'Jobseeker management'
        : 'Dashboard'

  return (
    <AppShell
      homeHref={ROUTES.HOME}
      product="Admin"
      navLabel="WORKSPACE"
      note="Manage the MatchingJobs platform"
      items={[
        { to: ROUTES.HOME, label: 'Dashboard', icon: LayoutDashboard, end: true },
        { to: ROUTES.COMPANIES, label: 'Companies', icon: Building2 },
        { to: ROUTES.JOB_SEEKERS, label: 'Jobseekers', icon: Users },
        { to: ROUTES.PROFILE, label: 'Profile', icon: CircleUser },
      ]}
      headerKicker="ADMIN PORTAL"
      headerTitle={headerTitle}
      userName={user.name || user.email || FALLBACK_NAME}
      avatarUrl={user.avatar_url}
      logoutLabel="Sign out"
      notificationRequest={api.request}
      notificationBase="/admin/notifications"
      onLogout={() => {
        void logout().finally(() => navigate(ROUTES.LOGIN, { replace: true }))
      }}
    >
      <Outlet />
    </AppShell>
  )
}
