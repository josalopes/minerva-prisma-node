export type ActionResult<T = unknown> = {
  success: boolean
  message?: string | null
  errors?: Record<string, string[]>
  data?: T
}