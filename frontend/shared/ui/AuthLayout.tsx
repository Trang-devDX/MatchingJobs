import { Link, Outlet } from 'react-router-dom'

export function AuthLayout({
  homeHref,
  product,
  eyebrow,
  title,
  description,
  footnote,
}: {
  homeHref: string
  product: string
  eyebrow: string
  title: string
  description: string
  footnote: string
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex flex-col justify-between bg-navy px-6 py-8 text-white sm:px-10 lg:px-12 lg:py-10">
        <Link to={homeHref} className="inline-flex items-center gap-3 font-semibold">
          <span className="grid size-10 place-items-center rounded-2xl bg-accent text-lg text-white">M</span>
          <span>MatchingJobs <small className="block text-xs font-medium tracking-wide text-white/70">{product}</small></span>
        </Link>
        <div className="my-10 max-w-md">
          <p className="text-xs font-semibold tracking-[0.14em] text-white/70">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-4 text-base leading-7 text-white/80">{description}</p>
        </div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} MatchingJobs</p>
      </section>
      <section className="flex flex-col justify-center bg-canvas px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
          <Outlet />
          <p className="mt-6 text-sm text-muted">{footnote}</p>
        </div>
      </section>
    </main>
  )
}
