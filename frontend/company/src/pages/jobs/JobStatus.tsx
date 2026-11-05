import { cn } from '@shared/lib/cn'
import { statusLabel } from '@/services/job-listing.service'

export function JobStatus({ status }: { status: number }) {
  return (
    <span
      className={cn(
        'inline-flex min-w-20 items-center justify-center rounded-full px-3 py-1 text-xs font-semibold',
        status === 1 && 'bg-success-soft text-success',
        status === 2 && 'bg-canvas text-muted',
        status === 9 && 'bg-warn-soft text-warn',
      )}
    >
      {statusLabel(status)}
    </span>
  )
}
