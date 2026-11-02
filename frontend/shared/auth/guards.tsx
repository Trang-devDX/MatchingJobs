import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Button } from '../ui/Button'
import { StatusScreen, RetryAction } from '../ui/StatusScreen'
import { useAuth } from './context'

type GuardCopy = {
  loadingLabel: string
  errorLabel: string
  retryLabel: string
  signOutLabel: string
}

export function RequireAuth({ loginPath, copy }: { loginPath: string; copy: GuardCopy }) {
  const location = useLocation()
  const { status, retry, logout } = useAuth()

  if (status === 'anonymous') {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}${location.hash}`)
    return <Navigate to={`${loginPath}?redirect=${redirect}`} replace />
  }

  if (status === 'loading') return <StatusScreen label={copy.loadingLabel} />
  if (status === 'error') {
    return (
      <StatusScreen
        label={copy.errorLabel}
        action={<SessionActions copy={copy} onRetry={retry} onSignOut={() => void logout()} />}
      />
    )
  }

  return <Outlet />
}

export function GuestOnly({ homePath, copy }: { homePath: string; copy: GuardCopy }) {
  const { status, retry, logout } = useAuth()

  if (status === 'authenticated') return <Navigate to={homePath} replace />
  if (status === 'loading') return <StatusScreen label={copy.loadingLabel} />
  if (status === 'error') {
    return (
      <StatusScreen
        label={copy.errorLabel}
        action={<SessionActions copy={copy} onRetry={retry} onSignOut={() => void logout()} />}
      />
    )
  }

  return <Outlet />
}

function SessionActions({
  copy,
  onRetry,
  onSignOut,
}: {
  copy: GuardCopy
  onRetry: () => void
  onSignOut: () => void
}) {
  return (
    <div className="flex justify-center gap-3">
      <RetryAction label={copy.retryLabel} onRetry={onRetry} />
      <Button variant="ghost" onClick={onSignOut}>{copy.signOutLabel}</Button>
    </div>
  )
}
