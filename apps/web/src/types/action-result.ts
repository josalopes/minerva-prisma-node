export type ActionResult<T = unknown> = {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: T
}
