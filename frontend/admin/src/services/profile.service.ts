import { createProfileService } from '@shared/profile/service'
import { api } from './api'

export const ProfileService = createProfileService(api, {
  show: '/admin/profile',
  update: '/admin/profile',
  avatar: '/admin/profile/avatar',
})
