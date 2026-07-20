import { QaResult } from './qa-result'

export interface QaReport {
  filesScanned: number
  rulesExecuted: number
  durationMs: number
  results: QaResult[]
}
