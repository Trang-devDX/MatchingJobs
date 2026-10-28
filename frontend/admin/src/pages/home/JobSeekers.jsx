import { useEffect, useState } from 'react'
import { JobSeekerService } from '../../services/job-seeker.service'

const initialForm = { first_name: '', middle_name: '', last_name: '', email: '', password: '', phone_number: '', gender: '', date_of_birth: '', job_seeking_status: '', status: 1 }
const currentPath = () => window.location.pathname.replace(/\/$/, '')

function JobSeekerForm({ id, onBack }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(Boolean(id))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (!id) return
    JobSeekerService.get(id).then((data) => setForm({ ...initialForm, ...data, gender: data.gender ?? '', job_seeking_status: data.job_seeking_status ?? '', password: '' }))
      .catch((requestError) => setLoadError(requestError.message)).finally(() => setLoading(false))
  }, [id])

  function update(event) {
    setForm((value) => ({ ...value, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSaving(true)
    const payload = { ...form, gender: form.gender || null, job_seeking_status: form.job_seeking_status || null }
    if (!payload.password) delete payload.password
    try {
      await JobSeekerService.save(payload, id)
      window.location.assign('/job-seekers')
    } catch (requestError) {
      setError(requestError.message)
      setFieldErrors(requestError.errors || {})
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="state-message" role="status">Loading jobseeker…</p>
  if (loadError) return <section><p className="state-error" role="alert">{loadError}</p><button className="text-button" onClick={() => window.location.reload()} type="button">Retry</button></section>
  return (
    <section>
      <button className="text-button back-button" onClick={onBack} type="button">← Jobseekers</button>
      <div className="page-heading"><div><p className="eyebrow">JOBSEEKER MANAGEMENT</p><h1>{id ? 'Edit jobseeker' : 'Add jobseeker'}</h1><p>Manage account and profile details.</p></div></div>
      <form className="admin-form" onSubmit={submit}>
        {error && <p className="state-error" role="alert">{error}</p>}
        <div className="form-grid">
          <Field label="First name" name="first_name" value={form.first_name} onChange={update} required errors={fieldErrors} />
          <Field label="Middle name" name="middle_name" value={form.middle_name || ''} onChange={update} errors={fieldErrors} />
          <Field label="Last name" name="last_name" value={form.last_name || ''} onChange={update} errors={fieldErrors} />
          <Field label="Email" name="email" type="email" value={form.email} onChange={update} required errors={fieldErrors} />
          <Field label={id ? 'New password (optional)' : 'Password'} name="password" type="password" value={form.password} onChange={update} required={!id} errors={fieldErrors} />
          <Field label="Phone number" name="phone_number" value={form.phone_number || ''} onChange={update} errors={fieldErrors} />
          <label className="admin-field"><span>Gender</span><select name="gender" value={form.gender} onChange={update}><option value="">Not specified</option><option value="1">Male</option><option value="2">Female</option><option value="9">Other</option></select></label>
          <Field label="Date of birth" name="date_of_birth" type="date" value={form.date_of_birth || ''} onChange={update} errors={fieldErrors} />
          <label className="admin-field"><span>Job seeking status</span><select name="job_seeking_status" value={form.job_seeking_status} onChange={update}><option value="">Not specified</option><option value="1">Seeking</option><option value="2">Not seeking</option></select></label>
          {id && <label className="admin-field"><span>Account status</span><select name="status" value={form.status} onChange={update}><option value="1">Active</option><option value="9">Disabled</option></select></label>}
        </div>
        <div className="form-actions"><button className="secondary-action" onClick={onBack} type="button">Cancel</button><button className="primary-button" disabled={saving} type="submit">{saving ? 'Saving…' : 'Save jobseeker'}</button></div>
      </form>
    </section>
  )
}

function Field({ label, name, value, onChange, type = 'text', required = false, errors = {} }) {
  return <label className="admin-field"><span>{label}</span><input name={name} type={type} value={value ?? ''} onChange={onChange} required={required} />{errors[name]?.[0] && <small className="field-error">{errors[name][0]}</small>}</label>
}

export default function JobSeekers() {
  const path = currentPath()
  const parts = path.split('/').filter(Boolean)
  const id = parts[1] && parts[1] !== 'new' ? parts[1] : null
  const isForm = parts[1] === 'new' || parts[2] === 'edit'
  const isDetail = Boolean(id && !isForm)
  const [result, setResult] = useState(null)
  const [detail, setDetail] = useState(null)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (isForm || isDetail) return
    JobSeekerService.list(query, page).then((data) => { setResult(data); setError('') }).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false))
  }, [query, page, isForm, isDetail])

  useEffect(() => {
    if (!isDetail) return
    JobSeekerService.get(id).then(setDetail).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false))
  }, [id, isDetail])

  function searchJobSeekers(event) {
    event.preventDefault()
    const nextQuery = search.trim()
    if (nextQuery === query && page === 1) return
    setLoading(true)
    setPage(1)
    setQuery(nextQuery)
  }

  async function remove(jobSeeker) {
    if (!window.confirm(`Delete ${jobSeeker.name || jobSeeker.email}?`)) return
    setDeletingId(jobSeeker.id)
    try {
      await JobSeekerService.remove(jobSeeker.id)
      setResult((current) => ({
        ...current,
        data: current.data.filter((item) => item.id !== jobSeeker.id),
        meta: { ...current.meta, total: current.meta.total - 1 },
      }))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (isForm) return <JobSeekerForm id={parts[1] === 'new' ? null : id} onBack={() => window.location.assign('/job-seekers')} />
  if (isDetail) return loading ? <p className="state-message" role="status">Loading jobseeker…</p> : error ? <section><p className="state-error" role="alert">{error}</p><button className="text-button" onClick={() => window.location.reload()} type="button">Retry</button></section> : detail ? (
    <section>
      <a className="text-button back-button" href="/job-seekers">← Jobseekers</a>
      <div className="page-heading"><div><p className="eyebrow">JOBSEEKER PROFILE</p><h1>{detail.name || detail.email}</h1><p>{detail.email}</p></div><a className="primary-button" href={`/job-seekers/${id}/edit`}>Edit profile</a></div>
      <div className="detail-card"><dl>{[['Phone number', detail.phone_number], ['Gender', ({ 1: 'Male', 2: 'Female', 9: 'Other' })[detail.gender] || '—'], ['Date of birth', detail.date_of_birth || '—'], ['Job seeking status', ({ 1: 'Seeking', 2: 'Not seeking' })[detail.job_seeking_status] || 'Not specified'], ['Account status', Number(detail.status) === 1 ? 'Active' : 'Disabled'], ['Registered', detail.created_at ? new Date(detail.created_at).toLocaleDateString() : '—']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || '—'}</dd></div>)}</dl></div>
    </section>
  ) : null

  return (
    <section>
      <div className="page-heading"><div><p className="eyebrow">ACCOUNTS</p><h1>Jobseekers</h1><p>{result?.meta?.total ?? 0} registered accounts</p></div><a className="primary-button" href="/job-seekers/new">+ Add jobseeker</a></div>
      <form className="search-bar" onSubmit={searchJobSeekers}><input aria-label="Search jobseekers" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email" /><button className="secondary-action" type="submit">Search</button></form>
      {error && <p className="state-error" role="alert">{error} <button className="text-button" onClick={() => window.location.reload()}>Retry</button></p>}
      {loading ? <p className="state-message" role="status">Loading jobseekers…</p> : error ? null : !result?.data?.length ? <div className="empty-state"><strong>No jobseekers found</strong><span>Try another search or add a new account.</span></div> : (
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{result.data.map((jobSeeker) => <tr key={jobSeeker.id}><td><a className="table-link" href={`/job-seekers/${jobSeeker.id}`}>{jobSeeker.name || '—'}</a></td><td>{jobSeeker.email}</td><td>{jobSeeker.phone_number || '—'}</td><td><span className={`status-pill ${Number(jobSeeker.status) === 1 ? 'is-active' : 'is-disabled'}`}>{Number(jobSeeker.status) === 1 ? 'Active' : 'Disabled'}</span></td><td className="row-actions"><a href={`/job-seekers/${jobSeeker.id}/edit`}>Edit</a><button disabled={deletingId === jobSeeker.id} onClick={() => remove(jobSeeker)} type="button">{deletingId === jobSeeker.id ? 'Deleting…' : 'Delete'}</button></td></tr>)}</tbody></table>
          <div className="pagination"><span>Page {result.meta.current_page} of {result.meta.last_page}</span><div><button disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1) }} type="button">Previous</button><button disabled={page >= result.meta.last_page} onClick={() => { setLoading(true); setPage(page + 1) }} type="button">Next</button></div></div>
        </div>
      )}
    </section>
  )
}
