import { QaReport } from '../engine/qa-report'
import { QaResult } from '../engine/qa-result'

export function groupResultsByRule(
  report: QaReport,
): Record<string, QaResult[]> {
  return report.results.reduce(
    (groups, result) => {
      if (!groups[result.ruleId]) {
        groups[result.ruleId] = []
      }

      groups[result.ruleId].push(result)

      return groups
    },
    {} as Record<string, QaResult[]>,
  )
}
