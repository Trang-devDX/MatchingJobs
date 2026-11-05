import { Briefcase, CircleUser, ClipboardList, LayoutDashboard } from 'lucide-react'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/auth/context'
import { PushPrompt } from '@shared/firebase/PushPrompt'
import { syncPushToken } from '@shared/firebase/push'
import { AppShell } from '@shared/ui/AppShell'
import { FALLBACK_NAME } from '@/constants/copy'
import { ROUTES } from '@/constants/routes'
import { api } from '@/services/api'

export function JobSeekerShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!user) return
    void syncPushToken((body) => api.request('/jobseeker/device-tokens', { method: 'POST', body })).catch(() => undefined)
  }, [user])

  if (!user) return null

  const name = user.name || FALLBACK_NAME
  const headerTitle = location.pathname.startsWith(ROUTES.PROFILE)
    ? 'Profile'
    : location.pathname.startsWith(ROUTES.JOBS)
      ? 'Open jobs'
      : location.pathname.startsWith(ROUTES.APPLICATIONS)
        ? 'Applications'
        : 'Dashboard'

  return (
    <AppShell
      homeHref={ROUTES.HOME}
      product="Jobseeker"
      navLabel="WORKSPACE"
      note="Jobseeker portal"
      items={[
        { to: ROUTES.APP, label: 'Dashboard', icon: LayoutDashboard, end: true },
        { to: ROUTES.JOBS, label: 'Jobs', icon: Briefcase },
        { to: ROUTES.APPLICATIONS, label: 'Applications', icon: ClipboardList },
        { to: ROUTES.PROFILE, label: 'Profile', icon: CircleUser },
      ]}
      headerKicker="JOBSEEKER PORTAL"
      headerTitle={headerTitle}
      userName={name}
      avatarUrl={user.avatar_url}
      logoutLabel="Sign out"
      notificationRequest={api.request}
      notificationBase="/jobseeker/notifications"
      onLogout={() => {
        void logout().finally(() => navigate(ROUTES.HOME, { replace: true }))
      }}
    >
      <PushPrompt send={(body) => api.request('/jobseeker/device-tokens', { method: 'POST', body })} />
      <Outlet />
    </AppShell>
  )
}
