import { api } from './api'

export type AdminProfile = {
  id: string
  user_id: string | null
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

export const ProfileService = {
  async get(signal: AbortSignal) {
    const result = await api.request<AdminProfile>('/admin/profile', { signal })
    return result.data
  },

  async update(payload: ProfilePayload) {
    const result = await api.request<AdminProfile>('/admin/profile', { method: 'POST', body: payload })
    return result.data
  },

  async uploadAvatar(file: File | null, remove: boolean) {
    const formData = new FormData()
    if (file) formData.append('avatar', file)
    if (remove) formData.append('remove_avatar', '1')
    const result = await api.request<AdminProfile>('/admin/profile/avatar', { method: 'POST', formData })
    return result.data
  },
}
