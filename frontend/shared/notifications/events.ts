const listeners = new Set<() => void>()

export function onForegroundNotification(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function emitForegroundNotification() {
  listeners.forEach((listener) => listener())
}
