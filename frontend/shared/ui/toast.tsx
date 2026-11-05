import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '../lib/cn'

type ToastTone = 'success' | 'error' | 'warning' | 'info'

type ToastItem = {
  id: number
  tone: ToastTone
  message: string
}

const tones = {
  success: { icon: CheckCircle2, panel: 'border-green-200 bg-green-50 text-green-800' },
  error: { icon: XCircle, panel: 'border-red-200 bg-red-50 text-danger' },
  warning: { icon: AlertCircle, panel: 'border-amber-200 bg-amber-50 text-amber-800' },
  info: { icon: Info, panel: 'border-blue-200 bg-blue-50 text-blue-800' },
} as const

let publish: ((tone: ToastTone, message: string) => void) | null = null

function show(tone: ToastTone, message: string) {
  publish?.(tone, message)
}

export const notify = {
  success: (message: string) => show('success', message),
  error: (message: string) => show('error', message),
  warning: (message: string) => show('warning', message),
  info: (message: string) => show('info', message),
}

export function ToastViewport() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    const timers = new Set<number>()
    publish = (tone, message) => {
      const id = Date.now() + Math.random()
      setItems((current) => [...current, { id, tone, message }])
      const timer = window.setTimeout(() => {
        timers.delete(timer)
        setItems((current) => current.filter((item) => item.id !== id))
      }, 5000)
      timers.add(timer)
    }
    return () => {
      publish = null
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  if (items.length === 0) return null

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {items.map((item) => {
        const tone = tones[item.tone]
        const Icon = tone.icon
        return (
          <div key={item.id} role="status" className={cn('pointer-events-auto relative overflow-hidden rounded-xl border p-4 shadow-lg', tone.panel)}>
            <div className="flex items-start gap-3">
              <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
              <p className="flex-1 text-sm font-medium">{item.message}</p>
              <button
                type="button"
                className="rounded-full p-1 hover:bg-black/5"
                aria-label="Dismiss notification"
                onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <span className="absolute inset-x-0 bottom-0 h-1 origin-left animate-[toast-shrink_5s_linear_forwards] bg-current opacity-40" />
          </div>
        )
      })}
    </div>
  )
}
