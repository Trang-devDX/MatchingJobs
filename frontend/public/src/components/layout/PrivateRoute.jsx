export default function PrivateRoute({ checking, children }) {
  if (checking) return <main className="auth-loading">Đang kiểm tra phiên đăng nhập…</main>
  return children
}
