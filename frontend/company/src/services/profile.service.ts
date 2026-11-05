import { createProfileService } from '@shared/profile/service'
import { api } from './api'

export const ProfileService = createProfileService(api, {
  show: '/company/me',
  update: '/company/profile',
  avatar: '/company/profile/avatar',
})
