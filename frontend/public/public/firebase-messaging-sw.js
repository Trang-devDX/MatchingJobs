/* global firebase */
importScripts('/firebase-config.js')
importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js')

if (self.firebaseConfig && self.firebaseConfig.apiKey && self.firebaseConfig.projectId) {
  firebase.initializeApp(self.firebaseConfig)
  firebase.messaging().onBackgroundMessage(() => {
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      windows.forEach((window) => window.postMessage({ type: 'matchingjobs-notification' }))
    })
  })
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = new URL(event.notification.data?.url || '/', self.location.origin).href
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const existing = windows.find((window) => window.url.startsWith(self.location.origin))
      if (existing) {
        existing.navigate(target)
        return existing.focus()
      }
      return self.clients.openWindow(target)
    }),
  )
})
