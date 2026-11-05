import { createProfileService } from '@shared/profile/service'
import { api } from './api'

export const ProfileService = createProfileService(api, {
  show: '/jobseeker/me',
  update: '/jobseeker/profile',
  avatar: '/jobseeker/profile/avatar',
})
