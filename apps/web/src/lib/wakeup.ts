import { WakeupService } from '@/services/wakeup.service'

export const wakeupService = new WakeupService(process.env.NEXT_PUBLIC_API_URL!)
