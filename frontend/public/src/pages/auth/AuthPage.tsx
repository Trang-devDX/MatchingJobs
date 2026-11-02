import { CredentialsForm } from '@shared/auth/CredentialsForm'
import { useAuth } from '@shared/auth/context'
import { authCopy } from '@/constants/copy'
import { AUTH_PATHS, ROUTES } from '@/constants/routes'
import { AuthService } from '@/services/auth.service'

export function AuthPage({ mode }: { mode: 'login' | 'forgot' | 'reset' }) {
  const { login } = useAuth()

  return (
    <CredentialsForm
      key={mode}
      mode={mode}
      copy={authCopy}
      homePath={ROUTES.APP}
      loginPath={ROUTES.LOGIN}
      forgotPath={ROUTES.FORGOT_PASSWORD}
      authPaths={AUTH_PATHS}
      onLogin={async (values) => {
        await login(values)
      }}
      onForgot={AuthService.forgotPassword}
      onReset={AuthService.resetPassword}
    />
  )
}
