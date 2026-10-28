import { AuthService } from '../../services/auth.service'

export default function Dashboard({ user }) {
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
    <main className="jobseeker-app">
      <header className="public-header"><a className="public-brand" href="/">MatchingJobs</a><button className="header-link" onClick={signOut}>Đăng xuất</button></header>
      <section className="dashboard-card"><p className="eyebrow">KHÔNG GIAN ỨNG VIÊN</p><h1>Xin chào{user?.name ? `, ${user.name}` : ''}</h1><p>Bạn đã đăng nhập vào tài khoản tìm việc.</p><div className="profile-line"><span>Email</span><strong>{user?.email}</strong></div></section>
    </main>
  )
}
