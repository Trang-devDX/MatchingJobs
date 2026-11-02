/** Keeps post-login redirects inside this origin. Rejects `//host` and other sites. */
export function safeInternalPath(value: string | null, origin = window.location.origin) {
  if (!value || value.startsWith('//')) return null

  try {
    const url = new URL(value, origin)
    if (url.origin !== origin) return null
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return null
  }
}

export function redirectToLogin(loginPath: string) {
  if (window.location.pathname === loginPath) {
    window.location.reload()
    return
  }

  const path = `${window.location.pathname}${window.location.search}${window.location.hash}`
  window.location.assign(`${loginPath}?redirect=${encodeURIComponent(path)}`)
}

export function isAuthPath(path: string, authPaths: string[]) {
  const pathname = path.split(/[?#]/)[0] || '/'
  return authPaths.includes(pathname)
}
