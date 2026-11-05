import { createProfileHooks } from '@shared/profile/hooks'
import { ProfileService } from '@/services/profile.service'

export const { useProfile, useSaveProfile } = createProfileHooks(ProfileService, ['jobseeker-profile'])
