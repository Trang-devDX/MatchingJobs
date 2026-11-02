import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { JobSeekerPayload } from '@/services/job-seeker.service'
import { JobSeekerService } from '@/services/job-seeker.service'

export function useJobSeekers(search: string, page: number) {
  return useQuery({
    queryKey: ['job-seekers', { search, page }],
    queryFn: ({ signal }) => JobSeekerService.list(search, page, signal),
    placeholderData: keepPreviousData,
  })
}

export function useJobSeeker(id: string | undefined) {
  return useQuery({
    queryKey: ['job-seekers', 'detail', id],
    queryFn: ({ signal }) => JobSeekerService.get(id as string, signal),
    enabled: Boolean(id),
  })
}

export function useSaveJobSeeker() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: JobSeekerPayload }) => JobSeekerService.save(payload, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['job-seekers'] }),
  })
}

export function useDeleteJobSeeker() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => JobSeekerService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['job-seekers'] }),
  })
}
