import { useState } from 'react'

export default function AdminSignIn({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setIsLoading(true)

    try {
      await onLogin({ email, password })
    } catch (requestError) {
      setFieldErrors(requestError.errors || {})
      setError(requestError.message || 'Đăng nhập không thành công. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="form-heading">
        <p className="eyebrow">ADMIN PORTAL</p>
        <h2>Welcome back</h2>
        <p className="form-intro">Sign in to manage your platform.</p>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="email">Email address</label>
          <input autoComplete="username" autoFocus id="email" name="email" onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" required type="email" value={email} />
          {fieldErrors.email && <p className="field-error">{fieldErrors.email[0]}</p>}
        </div>
        <div className="field-group">
          <div className="field-label-row"><label htmlFor="password">Password</label></div>
          <div className="password-input-wrap">
            <input autoComplete="current-password" id="password" name="password" onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required type={showPassword ? 'text' : 'password'} value={password} />
            <button aria-label={showPassword ? 'Hide password' : 'Show password'} className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} type="button">{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          {fieldErrors.password && <p className="field-error">{fieldErrors.password[0]}</p>}
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="submit-button" disabled={isLoading} type="submit">{isLoading ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="security-note">This area is for authorized MatchingJobs administrators only.</p>
    </>
  )
}
