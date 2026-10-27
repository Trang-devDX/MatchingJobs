import './App.css'
import AuthLayout from './components/layout/AuthLayout'
import PrivateRoute from './components/layout/PrivateRoute'
import { AUTH_ROUTES, ROUTES } from './constants/routes'
import { useAuthSession } from './hooks/useAuth'
import Dashboard from './pages/Dashboard'
import StaffForgotPassword from './pages/auth/StaffForgotPassword'
import StaffResetPassword from './pages/auth/StaffResetPassword'
import StaffSignIn from './pages/auth/StaffSignIn'

function App() {
  const path = window.location.pathname
  const isAuthRoute = AUTH_ROUTES.includes(path)
  const { user, checking } = useAuthSession(!isAuthRoute)

  if (isAuthRoute) {
    let page
    if (path === ROUTES.FORGOT_PASSWORD) page = <StaffForgotPassword />
    else if (path === ROUTES.RESET_PASSWORD) page = <StaffResetPassword />
    else page = <StaffSignIn />

    return <AuthLayout>{page}</AuthLayout>
  }

  return <PrivateRoute checking={checking}><Dashboard user={user} /></PrivateRoute>
}

export default App
