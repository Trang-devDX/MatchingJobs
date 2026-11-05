const KEY = 'matchingjobs.device_token'

export function readDeviceToken() {
  return localStorage.getItem(KEY)
}

export function writeDeviceToken(token: string) {
  localStorage.setItem(KEY, token)
}

export function clearDeviceToken() {
  localStorage.removeItem(KEY)
}
