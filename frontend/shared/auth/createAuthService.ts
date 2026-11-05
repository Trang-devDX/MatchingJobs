import type { ApiSuccess, LoginResult, RequestOptions } from '../api/types'
import { clearDeviceToken, readDeviceToken } from '../firebase/deviceToken'
import { toSessionUser } from './session'

type Client = {
  request: <T>(path: string, options?: RequestOptions) => Promise<ApiSuccess<T>>
}

type AuthPaths = {
  login: string
  me: string
  logout: string
  forgotPassword?: string
  resetPassword?: string
}

export type ResetPasswordInput = {
  email: string
  token: string
  password: string
  password_confirmation: string
}

/** Same auth calls for every portal. Only the URL prefix changes. */
export function createAuthService(client: Client, paths: AuthPaths, hasToken: () => string | null) {
  return {
    async login(credentials: { email: string; password: string }) {
      const deviceToken = readDeviceToken()
      const result = await client.request<LoginResult>(paths.login, {
        method: 'POST',
        body: {
          ...credentials,
          ...(deviceToken ? { device_token: deviceToken } : {}),
        },
        token: null,
      })
      return result.data
    },

    async me(signal: AbortSignal) {
      const result = await client.request<{
        id: string | number
        name?: string | null
        email: string
        avatar_url?: string | null
      }>(paths.me, { signal })
      return toSessionUser(result.data)
    },

    async logout() {
      if (!hasToken()) return
      const deviceToken = readDeviceToken()
      try {
        await client.request<null>(paths.logout, {
          method: 'POST',
          body: deviceToken ? { device_token: deviceToken } : {},
        })
      } finally {
        clearDeviceToken()
      }
    },

    async forgotPassword(email: string) {
      if (!paths.forgotPassword) throw new Error('Forgot password is not available for this portal.')
      const result = await client.request<null>(paths.forgotPassword, {
        method: 'POST',
        body: { email },
        token: null,
      })
      return result.message
    },

    async resetPassword(data: ResetPasswordInput) {
      if (!paths.resetPassword) throw new Error('Reset password is not available for this portal.')
      await client.request<null>(paths.resetPassword, { method: 'POST', body: data, token: null })
    },
  }
}
