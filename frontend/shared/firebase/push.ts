import { getApps, initializeApp, type FirebaseOptions } from 'firebase/app'
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging'
import { emitForegroundNotification } from '../notifications/events'
import { notify } from '../ui/toast'
import { clearDeviceToken, readDeviceToken, writeDeviceToken } from './deviceToken'

export type DeviceTokenBody = {
  token: string
  replaced_token?: string
}

type SendToken = (body: DeviceTokenBody) => Promise<unknown>

let messaging: Messaging | null = null
let listening = false

export function firebaseConfig(): FirebaseOptions {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
}

export function pushConfigured() {
  const config = firebaseConfig()
  return Boolean(
    config.apiKey &&
      config.projectId &&
      config.appId &&
      config.messagingSenderId &&
      import.meta.env.VITE_FIREBASE_VAPID_KEY,
  )
}

export function canAskForPush() {
  return pushConfigured() && typeof Notification !== 'undefined' && Notification.permission === 'default'
}

export async function enablePush(send: SendToken) {
  if (!pushConfigured() || typeof Notification === 'undefined') return null
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null
  return syncPushToken(send)
}

export async function syncPushToken(send: SendToken) {
  if (!pushConfigured() || typeof Notification === 'undefined' || Notification.permission !== 'granted') {
    return null
  }

  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
  const app = getApps()[0] ?? initializeApp(firebaseConfig())
  const current = messaging ?? (messaging = getMessaging(app))
  listen(current)

  const token = await getToken(current, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  })
  if (!token) return null

  const previous = readDeviceToken()
  if (previous === token) return token

  await send({
    token,
    ...(previous ? { replaced_token: previous } : {}),
  })
  writeDeviceToken(token)
  return token
}

function listen(current: Messaging) {
  if (listening) return
  listening = true
  onMessage(current, (payload) => {
    const body = payload.notification?.body || 'You have a new notification.'
    notify.info(body)
    emitForegroundNotification()
  })
  navigator.serviceWorker?.addEventListener('message', (event) => {
    if (event.data?.type === 'matchingjobs-notification') emitForegroundNotification()
  })
}

export { clearDeviceToken }
