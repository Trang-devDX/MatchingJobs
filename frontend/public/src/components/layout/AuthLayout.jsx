import { ROUTES } from '../../constants/routes'

export default function AuthLayout({ children }) {
  return (
    <main className="auth-page">
      <a className="auth-brand" href={ROUTES.HOME}>MatchingJobs</a>
      <section className="auth-card">
        <a className="back-link" href={ROUTES.HOME}>← Trang chủ</a>
        {children}
      </section>
      <p className="auth-footer">© {new Date().getFullYear()} MatchingJobs</p>
    </main>
  )
}
