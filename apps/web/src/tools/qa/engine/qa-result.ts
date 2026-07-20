export type QaSeverity = 'info' | 'warning' | 'error'

export interface QaResult {
  ruleId: string
  severity: QaSeverity
  file: string
  line?: number
  column?: number
  message: string
  suggestion?: string
}
