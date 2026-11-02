import type { ReactNode } from 'react'
import { Button } from './Button'

export function StatusScreen({
  label,
  action,
}: {
  label: string
  action?: ReactNode
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-6">
      <div className="max-w-md text-center">
        <p role="status" className="text-muted">{label}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </main>
  )
}

export function RetryAction({ label, onRetry }: { label: string; onRetry: () => void }) {
  return <Button variant="secondary" onClick={onRetry}>{label}</Button>
}
