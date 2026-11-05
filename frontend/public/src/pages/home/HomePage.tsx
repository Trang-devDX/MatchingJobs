import { Link } from 'react-router-dom'
import { useAuth } from '@shared/auth/context'
import { buttonClass } from '@shared/ui/buttonStyles'
import { ROUTES } from '@/constants/routes'

const points = [
  ['01', 'Find the right opportunity', 'Explore roles that match your skills and direction.'],
  ['02', 'Apply with confidence', 'Keep your profile ready and follow each application.'],
  ['03', 'Move closer to the goal', 'Take the next step in your career with MatchingJobs.'],
]

export function HomePage() {
  const { status } = useAuth()
  const signedIn = status === 'authenticated'
  const destination = signedIn ? ROUTES.APP : ROUTES.LOGIN
  const action = signedIn ? 'Open the app' : 'Sign in'

  return (
    <main className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link to={ROUTES.HOME} className="text-lg font-semibold">MatchingJobs</Link>
        <nav className="flex items-center gap-3">
          <Link to={destination} className="text-sm font-medium text-brand">{action}</Link>
          <Link to={destination} className={buttonClass('primary')}>{signedIn ? 'Open the app' : 'Find work'}</Link>
        </nav>
      </header>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-brand">THE RIGHT OPPORTUNITY, A BETTER PATH</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Good work starts with the right connection.</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted">Explore roles that fit your skills, goals, and life.</p>
          <Link to={destination} className={buttonClass('primary', 'mt-8')}>{action}</Link>
        </div>
        <div className="relative mx-auto grid min-h-72 w-full max-w-md place-items-center rounded-3xl bg-canvas">
          <div className="w-56 rounded-2xl border border-line bg-white p-5 shadow-sm">
            <p className="text-2xl text-brand" aria-hidden="true">✦</p>
            <div className="mt-4 space-y-2">
              <span className="block h-2 rounded-full bg-line" />
              <span className="block h-2 w-2/3 rounded-full bg-line" />
            </div>
            <p className="mt-5 text-sm font-semibold text-brand">98% match</p>
          </div>
          <p className="absolute top-8 right-8 rounded-full bg-white px-3 py-1 text-sm font-medium shadow-sm">New opportunity</p>
          <p className="absolute bottom-8 left-8 rounded-full bg-white px-3 py-1 text-sm font-medium shadow-sm">A fit for you</p>
        </div>
      </section>
      <section className="border-t border-line bg-canvas">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-3">
          {points.map(([index, title, body]) => (
            <article key={index}>
              <p className="text-sm font-semibold text-brand">{index}</p>
              <h2 className="mt-2 text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-muted">
        <span>© {new Date().getFullYear()} MatchingJobs</span>
        <Link to={destination} className="font-medium text-brand">{signedIn ? 'Open the app' : 'Jobseeker sign in'}</Link>
      </footer>
    </main>
  )
}
