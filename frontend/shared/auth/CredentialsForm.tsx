import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { applyApiErrors } from '../forms/applyApiErrors'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { PasswordField } from '../ui/PasswordField'
import { TextField } from '../ui/TextField'
import { isAuthPath, safeInternalPath } from './redirect'

export type AuthCopy = {
  loginTitle: string
  loginIntro: string
  forgotTitle: string
  forgotIntro: string
  resetTitle: string
  resetIntro: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  newPasswordLabel: string
  passwordPlaceholder: string
  confirmLabel: string
  showPassword: string
  hidePassword: string
  submitLogin: string
  submitForgot: string
  submitReset: string
  submitting: string
  forgotLink: string
  backToLogin: string
  goToLogin: string
  forgotSuccess: string
  resetSuccess: string
  invalidEmail: string
  passwordRequired: string
  passwordMin: string
  confirmMismatch: string
  missingToken: string
  genericError: string
}

type CredentialsFormProps = {
  mode: 'login' | 'forgot' | 'reset'
  copy: AuthCopy
  homePath: string
  loginPath: string
  forgotPath?: string
  authPaths: string[]
  onLogin?: (values: { email: string; password: string }) => Promise<void>
  onForgot?: (email: string) => Promise<string>
  onReset?: (values: { email: string; token: string; password: string; password_confirmation: string }) => Promise<void>
}

export function CredentialsForm(props: CredentialsFormProps) {
  if (props.mode === 'forgot') return <ForgotForm {...props} />
  if (props.mode === 'reset') return <ResetForm {...props} />
  return <LoginForm {...props} />
}

function FormIntro({ title, intro }: { title: string; intro: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold tracking-tight text-navy">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{intro}</p>
    </div>
  )
}

function LoginForm({ copy, homePath, forgotPath, authPaths, onLogin }: CredentialsFormProps) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const emailFromLink = params.get('email') ?? ''
  const [formError, setFormError] = useState('')
  const schema = z.object({
    email: z.string().trim().email(copy.invalidEmail),
    password: z.string().min(1, copy.passwordRequired),
  })
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: emailFromLink, password: '' },
  })

  async function submit(values: { email: string; password: string }) {
    setFormError('')
    try {
      await onLogin?.(values)
      const requested = safeInternalPath(params.get('redirect'))
      const destination = requested && !isAuthPath(requested, authPaths) ? requested : homePath
      navigate(destination, { replace: true })
    } catch (error) {
      setFormError(applyApiErrors(error, setError, copy.genericError))
    }
  }

  return (
    <>
      <FormIntro title={copy.loginTitle} intro={copy.loginIntro} />
      <form className="space-y-4" noValidate onSubmit={handleSubmit(submit)}>
        <TextField
          label={copy.emailLabel}
          type="email"
          autoComplete="username"
          autoFocus
          placeholder={copy.emailPlaceholder}
          readOnly={Boolean(emailFromLink)}
          error={errors.email?.message}
          {...register('email')}
        />
        <PasswordField
          label={copy.passwordLabel}
          autoComplete="current-password"
          placeholder={copy.passwordPlaceholder}
          showLabel={copy.showPassword}
          hideLabel={copy.hidePassword}
          error={errors.password?.message}
          {...register('password')}
        />
        {formError && <Alert>{formError}</Alert>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? copy.submitting : copy.submitLogin}
        </Button>
      </form>
      {forgotPath && <Link to={forgotPath} className="mt-4 inline-block text-sm font-medium text-accent">{copy.forgotLink}</Link>}
    </>
  )
}

function ForgotForm({ copy, loginPath, onForgot }: CredentialsFormProps) {
  const [params] = useSearchParams()
  const emailFromLink = params.get('email') ?? ''
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')
  const schema = z.object({
    email: z.string().trim().email(copy.invalidEmail),
  })
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: emailFromLink },
  })

  async function submit(values: { email: string }) {
    setFormError('')
    try {
      const message = await onForgot?.(values.email)
      setSuccess(message || copy.forgotSuccess)
    } catch (error) {
      setFormError(applyApiErrors(error, setError, copy.genericError))
    }
  }

  return (
    <>
      <FormIntro title={copy.forgotTitle} intro={copy.forgotIntro} />
      {success ? <Alert tone="success">{success}</Alert> : (
        <form className="space-y-4" noValidate onSubmit={handleSubmit(submit)}>
          <TextField
            label={copy.emailLabel}
            type="email"
            autoComplete="username"
            autoFocus
            placeholder={copy.emailPlaceholder}
            readOnly={Boolean(emailFromLink)}
            error={errors.email?.message}
            {...register('email')}
          />
          {formError && <Alert>{formError}</Alert>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? copy.submitting : copy.submitForgot}
          </Button>
        </form>
      )}
      <Link to={loginPath} className="mt-4 inline-block text-sm font-medium text-accent">{copy.backToLogin}</Link>
    </>
  )
}

function ResetForm({ copy, loginPath, onReset }: CredentialsFormProps) {
  const [params] = useSearchParams()
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')
  const schema = z.object({
    password: z.string().min(8, copy.passwordMin),
    password_confirmation: z.string(),
  }).refine((values) => values.password === values.password_confirmation, {
    path: ['password_confirmation'],
    message: copy.confirmMismatch,
  })
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: '', password_confirmation: '' },
  })

  async function submit(values: { password: string; password_confirmation: string }) {
    const token = params.get('token') ?? ''
    if (!token) {
      setFormError(copy.missingToken)
      return
    }

    setFormError('')
    try {
      await onReset?.({
        email: params.get('email') ?? '',
        token,
        password: values.password,
        password_confirmation: values.password_confirmation,
      })
      setSuccess(copy.resetSuccess)
    } catch (error) {
      setFormError(applyApiErrors(error, setError, copy.genericError))
    }
  }

  return (
    <>
      <FormIntro title={copy.resetTitle} intro={copy.resetIntro} />
      {success ? <Alert tone="success">{success}</Alert> : (
        <form className="space-y-4" noValidate onSubmit={handleSubmit(submit)}>
          <PasswordField
            label={copy.newPasswordLabel}
            autoComplete="new-password"
            autoFocus
            placeholder={copy.passwordPlaceholder}
            showLabel={copy.showPassword}
            hideLabel={copy.hidePassword}
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordField
            label={copy.confirmLabel}
            autoComplete="new-password"
            placeholder={copy.passwordPlaceholder}
            showLabel={copy.showPassword}
            hideLabel={copy.hidePassword}
            error={errors.password_confirmation?.message}
            {...register('password_confirmation')}
          />
          {formError && <Alert>{formError}</Alert>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? copy.submitting : copy.submitReset}
          </Button>
        </form>
      )}
      <Link to={loginPath} className="mt-4 inline-block text-sm font-medium text-accent">
        {success ? copy.goToLogin : copy.backToLogin}
      </Link>
    </>
  )
}
