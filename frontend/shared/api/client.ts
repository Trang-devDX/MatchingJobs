import { ApiError, toApiError } from './errors'
import type { ApiSuccess, RequestOptions } from './types'

type ApiClientOptions = {
  baseUrl: string
  getToken: () => string | null
  onUnauthorized: () => void
}

export function resolveApiBaseUrl() {
  const configured = import.meta.env.VITE_API_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')
  return `${window.location.protocol}//${window.location.hostname}:8000/api`
}

/**
 * One HTTP boundary for every portal.
 * Services call this. Pages never call fetch.
 * A 401 on an authenticated request clears the session. Login sends `token: null`,
 * so a wrong password stays on the form instead of reloading it.
 */
export function createApiClient({ baseUrl, getToken, onUnauthorized }: ApiClientOptions) {
  async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiSuccess<T>> {
    const headers = new Headers({ Accept: 'application/json' })
    const token = options.token === undefined ? getToken() : options.token
    if (token) headers.set('Authorization', `Bearer ${token}`)

    let body: BodyInit | undefined
    if (options.formData) {
      body = options.formData
    } else if (options.body !== undefined) {
      headers.set('Content-Type', 'application/json')
      body = JSON.stringify(options.body)
    }

    let response: Response
    try {
      response = await fetch(`${baseUrl}${path}`, {
        method: options.method ?? 'GET',
        headers,
        body,
        signal: options.signal,
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error
      throw new ApiError('Network error. Please try again.', 0)
    }

    let payload: unknown = null
    try {
      payload = await response.json()
    } catch {
      throw new ApiError('The server returned an unexpected response.', response.status)
    }

    const succeeded = response.ok && Boolean(payload && typeof payload === 'object' && 'success' in payload && payload.success)
    if (!succeeded) {
      if (response.status === 401 && token) onUnauthorized()
      throw toApiError(response.status, payload, 'Request failed.')
    }

    return payload as ApiSuccess<T>
  }

  return { request }
}
