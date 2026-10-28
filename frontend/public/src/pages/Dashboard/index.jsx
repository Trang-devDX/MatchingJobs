import { useEffect, useState } from 'react'
import { AuthService } from '../../services/auth.service'
import { DashboardService } from '../../services/dashboard.service'
import { ROUTES } from '../../constants/routes'

const cards = [
  ['total_applications', 'Tổng hồ sơ đã ứng tuyển'],
  ['pending_applications', 'Hồ sơ đang chờ xử lý'],
  ['saved_jobs', 'Công việc đã lưu'],
  ['followed_companies', 'Công ty đang theo dõi'],
]

export default function Dashboard({ user }) {
  const name = user?.name || 'Ứng viên'
  const initials = name.slice(0, 1).toUpperCase()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    DashboardService.get()
      .then(setStats)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  async function signOut() {
    try {
      await AuthService.logout()
    } catch {
      AuthService.clearSession()
    } finally {
      window.location.assign('/')
    }
  }

  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <a href={ROUTES.HOME} className="portal-brand"><span className="portal-brand-mark">M</span><span>MatchingJobs</span></a>
        <p className="portal-nav-label">WORKSPACE</p>
        <nav aria-label="Điều hướng ứng viên"><a className="portal-nav-link is-current" href={ROUTES.APP}><span aria-hidden="true">▦</span>Dashboard</a></nav>
        <div className="portal-sidebar-note">Jobseeker portal</div>
      </aside>
      <div className="portal-main">
        <header className="portal-topbar"><div><span className="portal-kicker">JOBSEEKER PORTAL</span><strong>Dashboard</strong></div><div className="portal-account"><span className="portal-avatar" aria-hidden="true">{initials}</span><span className="portal-account-name">{name}</span><button className="header-link" onClick={signOut} type="button">Đăng xuất</button></div></header>
        <main className="portal-content">
          <div className="portal-heading"><p className="eyebrow">TỔNG QUAN ỨNG VIÊN</p><h1>Xin chào, {name}</h1><p>Tóm tắt hoạt động tìm việc của bạn.</p></div>
          {loading ? <p className="state-message" role="status">Đang tải dashboard…</p> : error ? (
            <div className="state-error" role="alert">{error} <button className="text-button" onClick={() => window.location.reload()} type="button">Thử lại</button></div>
          ) : (
            <div className="portal-stats-grid">{cards.map(([key, label]) => <article className="portal-stat-card" key={key}><span>{label}</span><strong>{Number(stats?.[key] ?? 0).toLocaleString()}</strong></article>)}</div>
          )}
        </main>
      </div>
    </div>
  )
}
