import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'

export function firebaseMessagingConfig(configUrl) {
  const root = dirname(fileURLToPath(configUrl))

  function write(mode) {
    const env = { ...loadEnv(mode, root, 'VITE_FIREBASE_'), ...process.env }
    const config = {
      apiKey: env.VITE_FIREBASE_API_KEY ?? '',
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
      projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
      appId: env.VITE_FIREBASE_APP_ID ?? '',
    }
    writeFileSync(join(root, 'public/firebase-config.js'), `self.firebaseConfig = ${JSON.stringify(config)};\n`)
  }

  return {
    name: 'firebase-messaging-config',
    configResolved(config) {
      write(config.mode)
    },
  }
}
