import type { AuthCopy } from '@shared/auth/CredentialsForm'

export const authCopy: AuthCopy = {
  loginTitle: 'Welcome back',
  loginIntro: 'Sign in to continue your job search.',
  forgotTitle: 'Forgot your password?',
  forgotIntro: 'Enter your email to receive a reset link.',
  resetTitle: 'Choose a new password',
  resetIntro: 'Set a new password for your account.',
  emailLabel: 'Email',
  emailPlaceholder: 'you@email.com',
  passwordLabel: 'Password',
  newPasswordLabel: 'New password',
  passwordPlaceholder: 'Enter your password',
  confirmLabel: 'Confirm password',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  submitLogin: 'Sign in',
  submitForgot: 'Send link',
  submitReset: 'Reset password',
  submitting: 'Working…',
  forgotLink: 'Forgot password?',
  backToLogin: 'Back to sign in',
  goToLogin: 'Go to sign in',
  forgotSuccess: 'Password reset instructions were sent to your email.',
  resetSuccess: 'Your password has been reset. You can sign in.',
  invalidEmail: 'Enter a valid email address.',
  passwordRequired: 'Enter your password.',
  passwordMin: 'Use at least 8 characters.',
  confirmMismatch: 'The passwords do not match.',
  missingToken: 'This reset link is invalid.',
  genericError: 'The request failed. Please try again.',
}

export const guardCopy = {
  loadingLabel: 'Checking your session…',
  errorLabel: 'Could not load your session.',
  retryLabel: 'Retry',
  signOutLabel: 'Sign out',
}

export const FALLBACK_NAME = 'Jobseeker'
