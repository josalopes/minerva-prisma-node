import { QaContext } from '../engine/qa-context'
import { QaResult } from '../engine/qa-result'

import { BaseRule } from './base-rule'

export class NoConsoleRule extends BaseRule {
  readonly id = 'QA001'

  readonly title = 'Console.log'

  async run(context: QaContext): Promise<QaResult[]> {
    const results: QaResult[] = []

    const regex = /console\.(log|debug|info|warn|error)\s*\(/g

    for (const file of context.files) {
      const lines = file.content.split('\n')

      lines.forEach((line, index) => {
        const matches = [...line.matchAll(regex)]

        matches.forEach((match) => {
          results.push({
            ruleId: this.id,

            severity: 'warning',

            file: file.path,

            line: index + 1,

            column: (match.index ?? 0) + 1,

            message: `Uso de "${match[0]}" encontrado.`,

            suggestion:
              'Remova antes do deploy ou substitua por um logger apropriado.',
          })
        })
      })
    }

    return results
  }
}
