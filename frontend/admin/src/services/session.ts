import { createSessionStore, portalStorageKeys } from '@shared/auth/session'

export const session = createSessionStore(portalStorageKeys('admin'))
