import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CompanyService, StaffService, type CompanyPayload, type StaffPayload } from '@/services/company.service'

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: ({ signal }) => CompanyService.countries(signal),
  })
}

export function useCompanies(search: string, page: number) {
  return useQuery({
    queryKey: ['companies', { search, page }],
    queryFn: ({ signal }) => CompanyService.list(search, page, signal),
    placeholderData: keepPreviousData,
  })
}

export function useCompany(id: string | undefined) {
  return useQuery({
    queryKey: ['companies', 'detail', id],
    queryFn: ({ signal }) => CompanyService.get(id as string, signal),
    enabled: Boolean(id),
  })
}

export function useSaveCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: CompanyPayload }) => CompanyService.save(payload, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
  })
}

export function useDeleteCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => CompanyService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
  })
}

export function useStaffs(companyId: string, search: string, page: number) {
  return useQuery({
    queryKey: ['staffs', companyId, { search, page }],
    queryFn: ({ signal }) => StaffService.list(companyId, search, page, signal),
    placeholderData: keepPreviousData,
  })
}

export function useStaff(companyId: string | undefined, staffId: string | undefined) {
  return useQuery({
    queryKey: ['staffs', companyId, 'detail', staffId],
    queryFn: ({ signal }) => StaffService.get(companyId as string, staffId as string, signal),
    enabled: Boolean(companyId && staffId),
  })
}

export function useSaveStaff(companyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ staffId, payload }: { staffId?: string; payload: StaffPayload }) =>
      StaffService.save(companyId, payload, staffId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staffs', companyId] }),
  })
}

export function useDeleteStaff(companyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (staffId: string) => StaffService.remove(companyId, staffId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staffs', companyId] }),
  })
}
