import { QaReport } from '../engine/qa-report'

export class JsonReporter {
  render(report: QaReport): string {
    return JSON.stringify(report, null, 2)
  }
}
