import { useState } from 'react'
import { wakeupService } from '@/lib/wakeup'

export function useWakeup() {
  const [loading, setLoading] = useState(false)

  async function wakeServer() {
    setLoading(true)

    const ready = await wakeupService.waitUntilReady()

    setLoading(false)

    return ready
  }

  return {
    wakeServer,
    loading,
  }
}
