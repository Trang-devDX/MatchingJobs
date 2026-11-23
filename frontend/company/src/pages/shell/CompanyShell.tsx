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

export function CompanyShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!user) return
    void syncPushToken((body) => api.request('/company/device-tokens', { method: 'POST', body })).catch(() => undefined)
  }, [user])

  if (!user) return null

  const headerTitle = location.pathname.startsWith(ROUTES.PROFILE)
    ? 'Profile'
    : location.pathname.startsWith(ROUTES.APPLICATIONS)
      ? 'Applications'
      : location.pathname.startsWith(ROUTES.JOBS)
        ? 'Job listings'
        : 'Dashboard'

  return (
    <AppShell
      homeHref={ROUTES.HOME}
      product="Company"
      navLabel="WORKSPACE"
      note="Company portal"
      items={[
        { to: ROUTES.HOME, label: 'Dashboard', icon: LayoutDashboard, end: true },
        { to: ROUTES.JOBS, label: 'Job listings', icon: Briefcase },
        { to: ROUTES.APPLICATIONS, label: 'Applications', icon: ClipboardList },
        { to: ROUTES.PROFILE, label: 'Profile', icon: CircleUser },
      ]}
      headerKicker="COMPANY PORTAL"
      headerTitle={headerTitle}
      userName={user.name || FALLBACK_NAME}
      avatarUrl={user.avatar_url}
      logoutLabel="Sign out"
      notificationRequest={api.request}
      notificationBase="/company/notifications"
      onLogout={() => {
        void logout().finally(() => navigate(ROUTES.LOGIN, { replace: true }))
      }}
    >
      <PushPrompt send={(body) => api.request('/company/device-tokens', { method: 'POST', body })} />
      <Outlet />
    </AppShell>
  )
}
