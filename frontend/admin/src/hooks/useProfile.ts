import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ProfileService, type ProfilePayload } from '@/services/profile.service'

export function useProfile() {
  return useQuery({
    queryKey: ['admin-profile'],
    queryFn: ({ signal }) => ProfileService.get(signal),
  })
}

export function useSaveProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { profile: ProfilePayload; avatar: File | null; removeAvatar: boolean }) =>
      saveProfile(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-profile'] }),
  })
}

async function saveProfile(input: { profile: ProfilePayload; avatar: File | null; removeAvatar: boolean }) {
  const profile = await ProfileService.update(input.profile)
  if (!input.avatar && !input.removeAvatar) return profile
  return ProfileService.uploadAvatar(input.avatar, input.removeAvatar)
}
