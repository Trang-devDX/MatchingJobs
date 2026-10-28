export default function AuthLayout({ children }) {
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
          <p className="brand-description">Manage your platform and help people find the opportunities that fit them.</p>
        </div>
        <p className="brand-footer">A better match starts here.</p>
      </section>
      <section className="form-panel">
        <div className="login-card">{children}</div>
        <p className="copyright">© {new Date().getFullYear()} MatchingJobs</p>
      </section>
    </main>
  )
}
