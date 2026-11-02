import { errorMessage } from '@shared/api/errors'
import { useAuth } from '@shared/auth/context'
import { Alert } from '@shared/ui/Alert'
import { Button } from '@shared/ui/Button'
import { PageHeader } from '@shared/ui/PageHeader'
import { StatGrid } from '@shared/ui/StatGrid'
import { FALLBACK_NAME } from '@/constants/copy'
import { useDashboard } from '@/hooks/useDashboard'

const cards = [
  ['total_applications', 'Tổng hồ sơ đã ứng tuyển'],
  ['pending_applications', 'Hồ sơ đang chờ xử lý'],
  ['saved_jobs', 'Công việc đã lưu'],
  ['followed_companies', 'Công ty đang theo dõi'],
] as const

export function DashboardPage() {
  const { user } = useAuth()
  const dashboard = useDashboard()
  const name = user?.name || FALLBACK_NAME

  return (
    <section>
      <PageHeader eyebrow="TỔNG QUAN ỨNG VIÊN" title={`Xin chào, ${name}`} description="Tóm tắt hoạt động tìm việc của bạn." />
      {dashboard.isLoading ? <p role="status" className="text-muted">Đang tải dashboard…</p> : null}
      {dashboard.isError ? (
        <Alert>
          {errorMessage(dashboard.error, 'Không tải được dashboard.')}{' '}
          <Button variant="ghost" onClick={() => void dashboard.refetch()}>Thử lại</Button>
        </Alert>
      ) : null}
      {dashboard.data ? (
        <StatGrid
          items={cards.map(([key, label]) => ({
            key,
            label,
            value: Number(dashboard.data?.[key] ?? 0),
          }))}
        />
      ) : null}
    </section>
  )
}
