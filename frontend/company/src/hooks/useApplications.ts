import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApplicationService } from '@/services/application.service'

export function useApplications(page: number) {
  return useQuery({
    queryKey: ['applications', page],
    queryFn: ({ signal }) => ApplicationService.list(page, signal),
    placeholderData: keepPreviousData,
  })
}

export function useApplication(id: string | undefined) {
  return useQuery({
    queryKey: ['applications', 'detail', id],
    queryFn: ({ signal }) => ApplicationService.get(id as string, signal),
    enabled: Boolean(id),
  })
}

export function useUpdateApplication(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { status: number; updatedAt: string }) => ApplicationService.updateStatus(id, input.status, input.updatedAt),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}
