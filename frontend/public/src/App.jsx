import './App.css'
import AuthLayout from './components/layout/AuthLayout'
import PrivateRoute from './components/layout/PrivateRoute'
import { AUTH_ROUTES, ROUTES } from './constants/routes'
import { useAuthSession } from './hooks/useAuth'
import Dashboard from './pages/Dashboard'
import JobSeekerForgotPassword from './pages/auth/JobSeekerForgotPassword'
import JobSeekerResetPassword from './pages/auth/JobSeekerResetPassword'
import JobSeekerSignIn from './pages/auth/JobSeekerSignIn'
import HomePage from './pages/home'

function App() {
  const path = window.location.pathname
  const isAuthRoute = AUTH_ROUTES.includes(path)
  const isPrivateRoute = path.startsWith(ROUTES.APP)
  const { user, checking } = useAuthSession(isPrivateRoute)

  if (isAuthRoute) {
    let page
    if (path === ROUTES.FORGOT_PASSWORD) page = <JobSeekerForgotPassword />
    else if (path === ROUTES.RESET_PASSWORD) page = <JobSeekerResetPassword />
    else page = <JobSeekerSignIn />

    return <AuthLayout>{page}</AuthLayout>
  }

  if (isPrivateRoute) {
    return <PrivateRoute checking={checking}><Dashboard user={user} /></PrivateRoute>
  }

  return <HomePage />
}

export default App
