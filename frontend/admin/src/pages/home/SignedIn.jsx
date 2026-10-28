import AdminDashboard from './AdminDashboard'
import JobSeekers from './JobSeekers'
import { ROUTES } from '../../constants/routes'

export default function SignedIn({ administrator, onLogout }) {
  const path = window.location.pathname.replace(/\/$/, '') || ROUTES.HOME
  const onJobSeekers = path === ROUTES.JOB_SEEKERS || path.startsWith(`${ROUTES.JOB_SEEKERS}/`)

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a href={ROUTES.HOME} className="admin-brand"><span className="brand-mark">M</span><span>MatchingJobs</span></a>
        <p className="nav-label">WORKSPACE</p>
        <nav aria-label="Admin navigation">
          <a className={`nav-link ${!onJobSeekers ? 'is-current' : ''}`} href={ROUTES.HOME}><span aria-hidden="true">▦</span>Dashboard</a>
          <a className={`nav-link ${onJobSeekers ? 'is-current' : ''}`} href={ROUTES.JOB_SEEKERS}><span aria-hidden="true">♙</span>Jobseekers</a>
        </nav>
        <div className="sidebar-note">Manage the MatchingJobs platform</div>
      </aside>
      <div className="admin-main">
        <header className="admin-header"><div><span className="header-kicker">ADMIN PORTAL</span><strong>{onJobSeekers ? 'Jobseeker management' : 'Dashboard'}</strong></div><div className="admin-account"><span className="avatar-circle">{(administrator.name || administrator.email || 'A').slice(0, 1).toUpperCase()}</span><span className="account-name">{administrator.name || administrator.email}</span><button type="button" className="logout-button" onClick={onLogout}>Sign out</button></div></header>
        <main className="admin-content">{onJobSeekers ? <JobSeekers /> : <AdminDashboard />}</main>
      </div>
    </div>
  )
}
