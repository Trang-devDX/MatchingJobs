import { Link } from 'react-router-dom'
import { buttonClass } from './buttonStyles'

export function NotFound({
  homeHref,
  title,
  body,
  action,
  embedded = false,
}: {
  homeHref: string
  title: string
  body: string
  action: string
  embedded?: boolean
}) {
  return (
    <main className={embedded ? 'py-16' : 'grid min-h-screen place-items-center bg-canvas px-6 py-16'}>
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold tracking-[0.14em] text-brand">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted">{body}</p>
        <Link to={homeHref} className={buttonClass('primary', 'mt-6')}>{action}</Link>
      </div>
    </main>
  )
}
