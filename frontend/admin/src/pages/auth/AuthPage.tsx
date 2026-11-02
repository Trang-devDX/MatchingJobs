import { CredentialsForm } from '@shared/auth/CredentialsForm'
import { useAuth } from '@shared/auth/context'
import { authCopy } from '@/constants/copy'
import { AUTH_PATHS, ROUTES } from '@/constants/routes'

export function AuthPage() {
  const { login } = useAuth()

  return (
    <CredentialsForm
      mode="login"
      copy={authCopy}
      homePath={ROUTES.HOME}
      loginPath={ROUTES.LOGIN}
      authPaths={AUTH_PATHS}
      onLogin={async (values) => {
        await login(values)
      }}
    />
  )
}
