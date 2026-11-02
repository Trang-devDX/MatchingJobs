import { fileURLToPath } from 'node:url'

// Shared source lives outside each app, so bare imports walk up from
// frontend/shared and miss that app's node_modules. Resolve them as if
// they were imported by the app entry.
export function resolveAppDeps(configUrl) {
  const sharedRoot = fileURLToPath(new URL('../shared/', configUrl)).replaceAll('\\', '/').toLowerCase()
  const fromApp = fileURLToPath(new URL('./src/main.tsx', configUrl))

  return {
    name: 'resolve-shared-deps',
    enforce: 'pre',
    async resolveId(id, importer, options) {
      if (!importer || !/^[\w@]/.test(id)) return null
      const importerPath = importer.split('?')[0].replaceAll('\\', '/').toLowerCase()
      if (!importerPath.startsWith(sharedRoot)) return null
      return this.resolve(id, fromApp, { ...options, skipSelf: true })
    },
  }
}
