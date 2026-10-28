export default function SignedIn({ administrator, onLogout }) {
  return (
    <div className="success-state" role="status">
      <div className="success-icon" aria-hidden="true">✓</div>
      <p className="eyebrow">SIGNED IN</p>
      <h2>Welcome{administrator.name ? `, ${administrator.name}` : ''}</h2>
      <p className="form-intro">You are signed in to the MatchingJobs admin account.</p>
      <button className="secondary-button" onClick={onLogout} type="button">Sign in with another account</button>
    </div>
  )
}
