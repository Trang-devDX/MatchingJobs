import type { ApiSuccess, RequestOptions } from '../api/types'

export type AppNotification = {
  id: string
  title: string
  body: string | null
  url: string | null
  read_at: string | null
  created_at: string | null
}

type Request = <T>(path: string, options?: RequestOptions) => Promise<ApiSuccess<T>>

export function createNotificationClient(request: Request, base: string) {
  return {
    async list(signal?: AbortSignal) {
      const result = await request<AppNotification[]>(base, { signal })
      return result.data
    },
    async unreadCount(signal?: AbortSignal) {
      const result = await request<{ count: number }>(`${base}/count`, { signal })
      return result.data.count
    },
    async markRead(id: string) {
      await request<null>(`${base}/${id}/read`, { method: 'POST', body: {} })
    },
    async markAllRead() {
      await request<null>(`${base}/read-all`, { method: 'POST', body: {} })
    },
  }
}

export type NotificationClient = ReturnType<typeof createNotificationClient>
