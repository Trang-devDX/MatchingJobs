import { useState } from 'react'
import { ROUTES } from '../../constants/routes'
import { AuthService } from '../../services/auth.service'

export default function AuthForm({ mode = 'login' }) {
  const params = new URLSearchParams(window.location.search)
  const emailFromLink = params.get('email') || ''
  const [email, setEmail] = useState(emailFromLink)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [message, setMessage] = useState('')
  const isForgot = mode === 'forgot'
  const isReset = mode === 'reset'

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setFieldErrors({})
    setMessage('')

    try {
      if (isForgot) {
        const result = await AuthService.forgotPassword(email)
        setMessage(result.message || 'Đã gửi hướng dẫn đặt lại mật khẩu vào email của bạn.')
      } else if (isReset) {
        await AuthService.resetPassword({
          email,
          token: params.get('token') || '',
          password,
          password_confirmation: confirmation,
        })
        setMessage('Mật khẩu đã được đặt lại. Bạn có thể đăng nhập.')
      } else {
        await AuthService.login({ email, password })
        let target = ROUTES.APP
        const redirect = params.get('redirect')
        if (redirect) {
          try {
            const url = new URL(redirect, window.location.origin)
            if (url.origin === window.location.origin) target = `${url.pathname}${url.search}${url.hash}`
          } catch {
            // Keep the jobseeker app route for invalid redirects.
          }
        }
        window.location.assign(target)
      }
    } catch (requestError) {
      setError(requestError.message)
      setFieldErrors(requestError.errors || {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <p className="eyebrow">DÀNH CHO ỨNG VIÊN</p>
      <h1>{isForgot ? 'Quên mật khẩu?' : isReset ? 'Đặt mật khẩu mới' : 'Chào mừng trở lại'}</h1>
      <p className="auth-intro">{isForgot ? 'Nhập email để nhận liên kết đặt lại mật khẩu.' : isReset ? 'Chọn mật khẩu mới cho tài khoản của bạn.' : 'Đăng nhập để tiếp tục hành trình nghề nghiệp.'}</p>
      {message ? <div className="success-message" role="status">{message}</div> : (
        <form className="auth-form" onSubmit={submit}>
          {!isReset && <div className="field-group"><label htmlFor="email">Email</label><input autoComplete="username" autoFocus id="email" onChange={(event) => setEmail(event.target.value)} placeholder="ban@email.com" required type="email" value={email} readOnly={Boolean(emailFromLink)} />{fieldErrors.email && <p className="field-error">{fieldErrors.email[0]}</p>}</div>}
          {!isForgot && <div className="field-group"><label htmlFor="password">{isReset ? 'Mật khẩu mới' : 'Mật khẩu'}</label><div className="password-wrap"><input autoComplete={isReset ? 'new-password' : 'current-password'} id="password" onChange={(event) => setPassword(event.target.value)} placeholder="Nhập mật khẩu" required type={showPassword ? 'text' : 'password'} value={password} /><button type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? 'Ẩn' : 'Hiện'}</button></div>{fieldErrors.password && <p className="field-error">{fieldErrors.password[0]}</p>}</div>}
          {isReset && <div className="field-group"><label htmlFor="password_confirmation">Xác nhận mật khẩu</label><input autoComplete="new-password" id="password_confirmation" onChange={(event) => setConfirmation(event.target.value)} required type="password" value={confirmation} />{fieldErrors.password_confirmation && <p className="field-error">{fieldErrors.password_confirmation[0]}</p>}</div>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" disabled={loading} type="submit">{loading ? 'Đang xử lý…' : isForgot ? 'Gửi liên kết' : isReset ? 'Đặt lại mật khẩu' : 'Đăng nhập'}</button>
        </form>
      )}
      {message && isReset && <a className="auth-inline-link" href={ROUTES.LOGIN}>Đến trang đăng nhập</a>}
      {!isReset && !isForgot && <a className="auth-inline-link forgot-link" href={ROUTES.FORGOT_PASSWORD}>Quên mật khẩu?</a>}
      {(isForgot || isReset) && <a className="auth-inline-link" href={ROUTES.LOGIN}>Quay lại đăng nhập</a>}
    </>
  )
}
