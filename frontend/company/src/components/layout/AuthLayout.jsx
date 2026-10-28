export default function AuthLayout({ children }) {
  return (
    <main className="login-page">
      <section className="brand-panel" aria-label="MatchingJobs Company">
        <a className="brand-lockup" href="/"><span className="brand-mark">M</span><span>MatchingJobs <small>Company</small></span></a>
        <div className="brand-copy"><p className="eyebrow">COMPANY PORTAL</p><h1>Find the people who move you forward.</h1><p className="brand-description">Manage your company’s hiring journey and connect with the right candidates.</p></div>
        <p className="brand-footer">A better match starts here.</p>
      </section>
      <section className="form-panel"><div className="login-card">{children}<p className="security-note">Chỉ nhân viên được ủy quyền mới có thể truy cập cổng công ty.</p></div><p className="copyright">© {new Date().getFullYear()} MatchingJobs</p></section>
    </main>
  )
}
