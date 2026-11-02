import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export function Alert({ tone = 'error', children }: { tone?: 'error' | 'success'; children: ReactNode }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-xl px-3 py-2 text-sm',
        tone === 'error' ? 'bg-red-50 text-danger' : 'bg-emerald-50 text-emerald-800',
      )}
    >
      {children}
    </div>
  )
}
