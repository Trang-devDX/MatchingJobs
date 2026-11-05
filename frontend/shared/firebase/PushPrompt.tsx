import { useState } from 'react'
import { Button } from '../ui/Button'
import type { DeviceTokenBody } from './push'
import { notify } from '../ui/toast'
import { canAskForPush, enablePush } from './push'

type PushPromptProps = {
  send: (body: DeviceTokenBody) => Promise<unknown>
}

export function PushPrompt({ send }: PushPromptProps) {
  const [visible, setVisible] = useState(canAskForPush)

  if (!visible) return null

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3">
      <p className="text-sm text-navy">Enable notifications to hear about application updates on this device.</p>
      <Button
        variant="secondary"
        onClick={() => {
          void enablePush(send)
            .then((token) => {
              if (!token) notify.warning('Notifications stay off until the browser allows them.')
            })
            .catch(() => notify.error('Could not enable notifications on this device.'))
            .finally(() => setVisible(false))
        }}
      >
        Enable notifications
      </Button>
    </div>
  )
}
