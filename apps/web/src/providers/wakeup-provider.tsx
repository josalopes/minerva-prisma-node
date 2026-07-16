import { WakeupService } from '@/services/wakeup.service'

const wakeup = new WakeupService(process.env.NEXT_PUBLIC_API_URL!)

export default wakeup
