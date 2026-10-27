import { AuthService } from '../../services/auth.service'

export default function Dashboard({ user }) {
  async function signOut() {
    try {
      await AuthService.logout()
    } catch {
      AuthService.clearSession()
    } finally {
      window.location.assign('/login')
    }
  }

  return (
    <main className="company-home">
      <header className="site-header"><a className="brand" href="/">MatchingJobs <span>Company</span></a><button className="text-button" onClick={signOut}>Đăng xuất</button></header>
      <section className="dashboard-card"><p className="eyebrow">CỔNG DÀNH CHO DOANH NGHIỆP</p><h1>Xin chào{user?.name ? `, ${user.name}` : ''}</h1><p>Bạn đã đăng nhập bằng tài khoản nhân viên công ty.</p><div className="profile-line"><span>Email</span><strong>{user?.email}</strong></div></section>
    </main>
  )
}
