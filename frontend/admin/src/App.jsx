import { useState } from 'react'
import './App.css'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:8000/api`

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [administrator, setAdministrator] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        setFieldErrors(result.errors ?? {})
        setError(result.message || 'Đăng nhập không thành công. Vui lòng thử lại.')
        return
      }

      const { user, token } = result.data
      localStorage.setItem('matchingjobs.admin.token', token)
      localStorage.setItem('matchingjobs.admin.user', JSON.stringify(user))
      setAdministrator(user)
    } catch {
      setError('Không kết nối được máy chủ. Hãy kiểm tra API backend đang chạy.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignOut() {
    const token = localStorage.getItem('matchingjobs.admin.token')

    try {
      if (token) {
        await fetch(`${API_BASE_URL}/admin/logout`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        })
      }
    } catch {
      // Clear the local session even if the API cannot be reached.
    } finally {
      localStorage.removeItem('matchingjobs.admin.token')
      localStorage.removeItem('matchingjobs.admin.user')
      setAdministrator(null)
      setPassword('')
    }
  }

  return (
    <main className="login-page">
      <section className="brand-panel" aria-label="MatchingJobs introduction">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>MatchingJobs</span>
        </div>

        <div className="brand-copy">
          <p className="eyebrow">ADMINISTRATION PORTAL</p>
          <h1>Build better connections.</h1>
          <p className="brand-description">
            Manage your platform and help people find the opportunities that fit them.
          </p>
        </div>

        <p className="brand-footer">A better match starts here.</p>
      </section>

      <section className="form-panel">
        <div className="login-card">
          {administrator ? (
            <div className="success-state" role="status">
              <div className="success-icon" aria-hidden="true">✓</div>
              <p className="eyebrow">SIGNED IN</p>
              <h2>Welcome{administrator.name ? `, ${administrator.name}` : ''}</h2>
              <p className="form-intro">
                You are signed in to the MatchingJobs admin account.
              </p>
              <button className="secondary-button" onClick={handleSignOut} type="button">
                Sign in with another account
              </button>
            </div>
          ) : (
            <>
              <div className="form-heading">
                <p className="eyebrow">ADMIN PORTAL</p>
                <h2>Welcome back</h2>
                <p className="form-intro">Sign in to manage your platform.</p>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="field-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    autoComplete="username"
                    autoFocus
                    id="email"
                    name="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@company.com"
                    required
                    type="email"
                    value={email}
                  />
                  {fieldErrors.email && <p className="field-error">{fieldErrors.email[0]}</p>}
                </div>

                <div className="field-group">
                  <div className="field-label-row">
                    <label htmlFor="password">Password</label>
                  </div>
                  <div className="password-input-wrap">
                    <input
                      autoComplete="current-password"
                      id="password"
                      name="password"
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                    />
                    <button
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="password-toggle"
                      onClick={() => setShowPassword((visible) => !visible)}
                      type="button"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="field-error">{fieldErrors.password[0]}</p>}
                </div>

                {error && <p className="form-error" role="alert">{error}</p>}

                <button className="submit-button" disabled={isLoading} type="submit">
                  {isLoading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>

              <p className="security-note">
                This area is for authorized MatchingJobs administrators only.
              </p>
            </>
          )}
        </div>
        <p className="copyright">© {new Date().getFullYear()} MatchingJobs</p>
      </section>
    </main>
  )
}

export default App
