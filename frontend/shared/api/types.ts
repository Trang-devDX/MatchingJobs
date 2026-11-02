export type PageMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type ApiSuccess<T> = {
  success: true
  data: T
  message: string
  meta?: PageMeta
}

export type LoginResult = {
  user: {
    id: string | number
    name?: string | null
    email: string
  }
  token: string
  token_type: string
  expires_in: number
}

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  /** `null` sends no Authorization header. Omit to attach the stored token. */
  token?: string | null
  signal?: AbortSignal
}
