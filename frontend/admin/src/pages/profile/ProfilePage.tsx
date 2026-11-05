import { useAuth } from '@shared/auth/context'
import { toSessionUser } from '@shared/auth/session'
import { AccountProfilePage } from '@shared/profile/AccountProfilePage'
import { useProfile, useSaveProfile } from '@/hooks/useProfile'

export function ProfilePage() {
  const query = useProfile()
  const save = useSaveProfile()
  const { syncUser } = useAuth()

  return (
    <AccountProfilePage
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      profile={query.data}
      pending={save.isPending}
      onRetry={() => {
        void query.refetch()
      }}
      onSave={async (input) => {
        const saved = await save.mutateAsync(input)
        syncUser(toSessionUser(saved))
      }}
    />
  )
}
