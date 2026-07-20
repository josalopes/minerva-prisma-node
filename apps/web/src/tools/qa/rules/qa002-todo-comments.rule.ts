import { BaseRule } from './base-rule'
import { QaContext } from '../engine/qa-context'
import { QaResult } from '../engine/qa-result'

export class TodoCommentsRule extends BaseRule {
  readonly id = 'QA002'
  readonly title = 'TODO/FIXME Comments'

  async run(context: QaContext): Promise<QaResult[]> {
    const results: QaResult[] = []

    const regex = /\b(TODO|FIXME|HACK|XXX)\b/g

    for (const file of context.files) {
      let match: RegExpExecArray | null

      while ((match = regex.exec(file.content)) !== null) {
        const { line, column } = this.getLineAndColumn(
          file.content,
          match.index,
        )

        results.push({
          ruleId: this.id,
          severity: 'warning',
          file: file.path,
          line,
          column,
          message: `Comentário ${match[1]} encontrado.`,
          suggestion:
            'Resolva a pendência ou remova o comentário antes do merge.',
        })
      }
    }

    return results
  }
}
