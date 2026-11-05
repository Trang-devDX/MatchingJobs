import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { firebaseMessagingConfig } from '../shared/firebaseMessagingPlugin.mjs'
import { resolveAppDeps } from '../shared/resolveAppDeps.mjs'

export default defineConfig({
  plugins: [resolveAppDeps(import.meta.url), firebaseMessagingConfig(import.meta.url), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  server: {
    port: 5175,
  },
})
