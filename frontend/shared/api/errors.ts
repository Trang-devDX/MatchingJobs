export class ApiError extends Error {
  status: number
  errors: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]> | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors ?? {}
  }
}

export function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError && error.message ? error.message : fallback
}

function normalizeErrors(errors: unknown): Record<string, string[]> {
  if (!errors || typeof errors !== 'object') return {}

  const normalized: Record<string, string[]> = {}
  for (const [field, value] of Object.entries(errors)) {
    if (Array.isArray(value)) normalized[field] = value.map(String)
    else if (typeof value === 'string') normalized[field] = [value]
  }
  return normalized
}

export function toApiError(status: number, payload: unknown, fallback: string) {
  const body = payload && typeof payload === 'object' ? payload as { message?: unknown; errors?: unknown } : {}
  const message = typeof body.message === 'string' && body.message ? body.message : fallback
  return new ApiError(message, status, normalizeErrors(body.errors))
}
