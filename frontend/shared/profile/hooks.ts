import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ProfileApi, ProfileSaveInput } from './service'

export function createProfileHooks(service: ProfileApi, queryKey: readonly string[]) {
  function useProfile() {
    return useQuery({
      queryKey,
      queryFn: ({ signal }) => service.get(signal),
    })
  }

  function useSaveProfile() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (input: ProfileSaveInput) => service.save(input),
      onSuccess: (profile) => queryClient.setQueryData(queryKey, profile),
    })
  }

  return { useProfile, useSaveProfile }
}
