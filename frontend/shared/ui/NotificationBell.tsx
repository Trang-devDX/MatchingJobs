import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { RequestOptions, ApiSuccess } from '../api/types'
import { createNotificationClient } from '../notifications/client'
import { onForegroundNotification } from '../notifications/events'
import { cn } from '../lib/cn'
import { Button } from './Button'

type Request = <T>(path: string, options?: RequestOptions) => Promise<ApiSuccess<T>>

export function NotificationBell({ request, base }: { request: Request; base: string }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const client = useMemo(() => createNotificationClient(request, base), [request, base])
  const countKey = ['notifications', 'count', base] as const
  const listKey = ['notifications', 'list', base] as const

  const count = useQuery({
    queryKey: countKey,
    queryFn: ({ signal }) => client.unreadCount(signal),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: () => (document.visibilityState === 'visible' ? 15_000 : false),
  })
  const list = useQuery({
    queryKey: listKey,
    queryFn: ({ signal }) => client.list(signal),
    enabled: open,
  })

  useEffect(() => onForegroundNotification(() => {
    void queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }), [queryClient])

  useEffect(() => {
    function refreshCount() {
      if (document.visibilityState !== 'visible') return
      void queryClient.invalidateQueries({ queryKey: ['notifications', 'count', base] })
    }
    document.addEventListener('visibilitychange', refreshCount)
    window.addEventListener('focus', refreshCount)
    return () => {
      document.removeEventListener('visibilitychange', refreshCount)
      window.removeEventListener('focus', refreshCount)
    }
  }, [queryClient, base])

  useEffect(() => {
    if (!open) return undefined
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const unread = count.data ?? 0
  const items = list.data ?? []

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  async function openItem(id: string, url: string | null, alreadyRead: boolean) {
    setOpen(false)
    if (!alreadyRead) {
      await client.markRead(id)
      await refresh()
    }
    if (url) navigate(url)
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="relative grid size-9 place-items-center rounded-full text-navy hover:bg-canvas"
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpen((current) => !current)
          void queryClient.invalidateQueries({ queryKey: countKey })
        }}
      >
        <Bell aria-hidden="true" size={18} />
        {unread > 0 ? (
          <span className="absolute -top-1 -right-1 z-10 grid min-h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-4 text-white ring-2 ring-white">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <div id={panelId} className="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-white shadow-lg">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            <Button
              variant="ghost"
              className="px-2 py-1 text-xs"
              disabled={unread === 0}
              onClick={() => {
                void client.markAllRead().then(refresh)
              }}
            >
              Mark all as read
            </Button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {list.isLoading ? <p className="px-4 py-6 text-sm text-muted">Loading notifications…</p> : null}
            {list.isError ? <p className="px-4 py-6 text-sm text-danger">Could not load notifications.</p> : null}
            {!list.isLoading && !list.isError && items.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted">No notifications yet.</p>
            ) : null}
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={cn('flex w-full gap-3 px-4 py-3 text-left hover:bg-canvas', !item.read_at && 'bg-accent/5')}
                    onClick={() => {
                      void openItem(item.id, item.url, Boolean(item.read_at))
                    }}
                  >
                    <span className={cn('mt-1 size-2 shrink-0 rounded-full', item.read_at ? 'bg-transparent' : 'bg-accent')} aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-medium text-navy">{item.title}</span>
                      {item.created_at ? (
                        <span className="mt-1 block text-xs text-muted">{new Date(item.created_at).toLocaleString()}</span>
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
