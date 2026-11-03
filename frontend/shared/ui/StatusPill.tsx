import { cn } from '../lib/cn'

export function StatusPill({
  active,
  activeLabel = 'Active',
  inactiveLabel = 'Disabled',
}: {
  active: boolean
  activeLabel?: string
  inactiveLabel?: string
}) {
  return (
    <span className={cn(
      'inline-flex min-w-20 items-center justify-center rounded-full px-3 py-1 text-xs font-semibold',
      active ? 'bg-success-soft text-success' : 'bg-warn-soft text-warn',
    )}>
      {active ? activeLabel : inactiveLabel}
    </span>
  )
}
