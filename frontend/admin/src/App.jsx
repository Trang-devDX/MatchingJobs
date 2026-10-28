import './App.css'
import AuthLayout from './components/layout/AuthLayout'
import { useAuth } from './hooks/useAuth'
import AdminSignIn from './pages/auth/AdminSignIn'
import SignedIn from './pages/home/SignedIn'

function App() {
  const { administrator, checking, login, logout } = useAuth()

  if (checking) return <p className="session-check">Checking your session…</p>
  if (administrator) return <SignedIn administrator={administrator} onLogout={logout} />

  return <AuthLayout><AdminSignIn onLogin={login} /></AuthLayout>
}

export default App
