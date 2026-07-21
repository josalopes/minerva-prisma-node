import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { QaReport } from '../engine/qa-report'
import { QaResult } from '../engine/qa-result'

import { JsonReporter } from '../reporters/json.reporter'
import { MarkdownReporter } from '../reporters/markdown.reporter'
import { groupResultsByRule } from '../utils/group-results-by-rule'

export class RuleReportWriter {
  private static readonly RULES_DIR = join(process.cwd(), 'reports', 'rules')

  static async save(report: QaReport): Promise<void> {
    await mkdir(this.RULES_DIR, {
      recursive: true,
    })

    // const groups = this.groupByRule(report)
    const groups = groupResultsByRule(report)

    const markdownReporter = new MarkdownReporter()
    const jsonReporter = new JsonReporter()

    for (const [ruleId, results] of Object.entries(groups)) {
      const ruleReport: QaReport = {
        ...report,
        results,
      }

      const markdown = markdownReporter.render(ruleReport)
      const json = jsonReporter.render(ruleReport)

      await writeFile(join(this.RULES_DIR, `${ruleId}.md`), markdown, 'utf8')

      await writeFile(join(this.RULES_DIR, `${ruleId}.json`), json, 'utf8')
    }
  }

  private static groupByRule(report: QaReport): Record<string, QaResult[]> {
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
}
