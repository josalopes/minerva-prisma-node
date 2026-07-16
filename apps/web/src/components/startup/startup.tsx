'use client'

import { useEffect } from 'react'
import { wakeupService } from '@/lib/wakeup'

export function Startup() {
  useEffect(() => {
    void wakeupService.waitUntilReady()
  }, [])

  return null
}
