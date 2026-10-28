import './App.css'
import AuthLayout from './components/layout/AuthLayout'
import { useAuth } from './hooks/useAuth'
import AdminSignIn from './pages/auth/AdminSignIn'
import SignedIn from './pages/home/SignedIn'

function App() {
  const { administrator, checking, login, logout } = useAuth()

  return (
    <AuthLayout>
      {checking ? <p className="form-intro">Checking your session…</p> : administrator ? (
        <SignedIn administrator={administrator} onLogout={logout} />
      ) : (
        <AdminSignIn onLogin={login} />
      )}
    </AuthLayout>
  )
}

export default App
