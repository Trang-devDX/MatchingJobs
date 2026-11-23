import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { JobService } from '@/services/job.service'

export function useJobs(search: string, page: number) {
  return useQuery({
    queryKey: ['jobs', search, page],
    queryFn: ({ signal }) => JobService.list(search, page, signal),
    placeholderData: keepPreviousData,
  })
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: ['jobs', 'detail', id],
    queryFn: ({ signal }) => JobService.get(id as string, signal),
    enabled: Boolean(id),
  })
}

export function useApply(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (coverLetter: string) => JobService.apply(id, coverLetter),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['jobs'] })
      await queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useApplications(page: number) {
  return useQuery({
    queryKey: ['applications', page],
    queryFn: ({ signal }) => JobService.applications(page, signal),
    placeholderData: keepPreviousData,
  })
}

export function useApplication(id: string | undefined) {
  return useQuery({
    queryKey: ['applications', 'detail', id],
    queryFn: ({ signal }) => JobService.application(id as string, signal),
    enabled: Boolean(id),
  })
}
