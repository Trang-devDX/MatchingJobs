import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import type { ApiSuccess, RequestOptions } from '../api/types'
import { cn } from '../lib/cn'
import { Button } from './Button'
import { NotificationBell } from './NotificationBell'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export function AppShell({
  homeHref,
  product,
  navLabel,
  note,
  items,
  headerKicker,
  headerTitle,
  userName,
  avatarUrl,
  logoutLabel,
  onLogout,
  notificationRequest,
  notificationBase,
  children,
}: {
  homeHref: string
  product: string
  navLabel: string
  note: string
  items: NavItem[]
  headerKicker: string
  headerTitle: string
  userName: string
  avatarUrl?: string | null
  logoutLabel: string
  onLogout: () => void
  notificationRequest: <T>(path: string, options?: RequestOptions) => Promise<ApiSuccess<T>>
  notificationBase: string
  children: ReactNode
}) {
  const initial = userName.slice(0, 1).toUpperCase() || '?'

  return (
    <div className="min-h-screen bg-canvas md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="flex flex-col gap-6 border-b border-line bg-white px-4 py-4 md:min-h-screen md:border-r md:border-b-0 md:px-5 md:py-6">
        <Link to={homeHref} className="inline-flex items-center gap-3 font-semibold text-navy">
          <span className="grid size-10 place-items-center rounded-2xl bg-accent text-sm text-white">M</span>
          <span>MatchingJobs <small className="block text-xs font-medium text-muted">{product}</small></span>
        </Link>
        <div>
          <p className="mb-2 hidden text-xs font-semibold tracking-[0.14em] text-muted md:block">{navLabel}</p>
          <nav className="flex gap-2 overflow-x-auto md:flex-col" aria-label={navLabel}>
            {items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => cn(
                    'inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm whitespace-nowrap transition',
                    isActive ? 'bg-accent font-semibold text-white' : 'font-medium text-ink hover:bg-canvas hover:text-accent',
                  )}
                >
                  <Icon aria-hidden="true" size={16} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </div>
        <p className="mt-auto hidden text-sm text-muted md:block">{note}</p>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-white px-4 py-3 md:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">{headerKicker}</p>
            <p className="font-semibold text-navy">{headerTitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell request={notificationRequest} base={notificationBase} />
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="size-9 rounded-full border border-line object-cover" aria-hidden="true" />
            ) : (
              <span className="grid size-9 place-items-center rounded-full bg-accent/10 text-sm font-semibold text-accent" aria-hidden="true">{initial}</span>
            )}
            <span className="hidden text-sm font-medium sm:inline">{userName}</span>
            <Button variant="ghost" onClick={onLogout}>{logoutLabel}</Button>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  )
}
