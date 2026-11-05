import type { ApiSuccess, RequestOptions } from '../api/types'

export type AccountProfile = {
  id: string
  name: string | null
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  email: string
  avatar_url: string | null
  updated_at: string | null
}

export type ProfilePayload = {
  first_name: string
  middle_name: string | null
  last_name: string
  updated_at: string
}

export type ProfileSaveInput = {
  profile: ProfilePayload
  avatar: File | null
  removeAvatar: boolean
}

type Client = {
  request: <T>(path: string, options?: RequestOptions) => Promise<ApiSuccess<T>>
}

type ProfilePaths = {
  show: string
  update: string
  avatar: string
}

export function createProfileService(client: Client, paths: ProfilePaths) {
  return {
    async get(signal: AbortSignal) {
      const result = await client.request<AccountProfile>(paths.show, { signal })
      return result.data
    },

    async update(payload: ProfilePayload) {
      const result = await client.request<AccountProfile>(paths.update, { method: 'POST', body: payload })
      return result.data
    },

    async uploadAvatar(file: File | null, remove: boolean) {
      const formData = new FormData()
      if (file) formData.append('avatar', file)
      if (remove) formData.append('remove_avatar', '1')
      const result = await client.request<AccountProfile>(paths.avatar, { method: 'POST', formData })
      return result.data
    },

    async save(input: ProfileSaveInput) {
      const profile = await this.update(input.profile)
      if (!input.avatar && !input.removeAvatar) return profile
      return this.uploadAvatar(input.avatar, input.removeAvatar)
    },
  }
}

export type ProfileApi = ReturnType<typeof createProfileService>
