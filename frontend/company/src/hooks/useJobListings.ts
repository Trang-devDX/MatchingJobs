import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { JobListingService, type JobFilters, type JobPayload } from '@/services/job-listing.service'

export function useJobListings(filters: JobFilters) {
  return useQuery({
    queryKey: ['job-listings', filters],
    queryFn: ({ signal }) => JobListingService.list(filters, signal),
    placeholderData: keepPreviousData,
  })
}

export function useJobListing(id: string | undefined) {
  return useQuery({
    queryKey: ['job-listings', 'detail', id],
    queryFn: ({ signal }) => JobListingService.get(id as string, signal),
    enabled: Boolean(id),
  })
}

export function useJobCatalog() {
  return useQuery({
    queryKey: ['job-catalog'],
    queryFn: async ({ signal }) => {
      const [industries, categories, types, educationLevels, countries] = await Promise.all([
        JobListingService.names('/company/job-industries', signal),
        JobListingService.names('/company/job-categories', signal),
        JobListingService.names('/company/job-types', signal),
        JobListingService.names('/company/education-levels', signal),
        JobListingService.names('/company/countries', signal),
      ])
      return { industries, categories, types, educationLevels, countries }
    },
  })
}

export function useIslands(countryId: string) {
  return useQuery({
    queryKey: ['islands', countryId],
    queryFn: ({ signal }) => JobListingService.names(`/company/countries/${countryId}/islands`, signal),
    enabled: Boolean(countryId),
  })
}

export function useTowns(islandId: string) {
  return useQuery({
    queryKey: ['towns', islandId],
    queryFn: ({ signal }) => JobListingService.names(`/company/islands/${islandId}/towns`, signal),
    enabled: Boolean(islandId),
  })
}

export function useCompanyPlace() {
  return useQuery({
    queryKey: ['company-place'],
    queryFn: ({ signal }) => JobListingService.company(signal),
  })
}

export function useSaveJobListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: JobPayload }) => JobListingService.save(payload, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['job-listings'] }),
  })
}

export function useCloseJobListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updatedAt }: { id: string; updatedAt: string }) => JobListingService.close(id, updatedAt),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['job-listings'] }),
  })
}

export function useDeleteJobListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => JobListingService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['job-listings'] }),
  })
}
