export function genderLabel(value: number | null) {
  if (value === 1) return 'Male'
  if (value === 2) return 'Female'
  if (value === 9) return 'Other'
  return '—'
}

export function seekingLabel(value: number | null) {
  if (value === 1) return 'Seeking'
  if (value === 2) return 'Not seeking'
  return 'Not specified'
}

export function accountStatusLabel(value: number | null) {
  return Number(value) === 1 ? 'Active' : 'Disabled'
}

export function formatDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString()
}
