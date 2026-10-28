import { useEffect, useState } from 'react'
import { JobSeekerService } from '../../services/job-seeker.service'
import { ROUTES } from '../../constants/routes'

const cards = [
  ['total_job_seekers', 'Jobseekers'],
  ['active_job_seekers', 'Active jobseekers'],
  ['total_jobs', 'Jobs'],
  ['active_jobs', 'Published jobs'],
  ['total_companies', 'Companies'],
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    JobSeekerService.dashboard()
      .then(setStats)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <div className="page-heading">
        <div><p className="eyebrow">OVERVIEW</p><h1>Dashboard</h1><p>Platform activity at a glance.</p></div>
        <a className="primary-button" href={ROUTES.JOB_SEEKERS}>Manage jobseekers</a>
      </div>
      {loading ? <p className="state-message" role="status">Loading dashboard…</p> : error ? (
        <div className="state-error" role="alert">{error} <button className="text-button" onClick={() => window.location.reload()}>Retry</button></div>
      ) : (
        <div className="stats-grid">
          {cards.map(([key, label]) => <article className="stat-card" key={key}><span>{label}</span><strong>{Number(stats?.[key] ?? 0).toLocaleString()}</strong></article>)}
        </div>
      )}
    </section>
  )
}
