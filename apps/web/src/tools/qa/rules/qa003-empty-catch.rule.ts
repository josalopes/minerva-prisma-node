import { BaseRule } from './base-rule'
import { QaContext } from '../engine/qa-context'
import { QaResult } from '../engine/qa-result'
import { BlockParser } from '../utils/block-parser'

export class EmptyCatchRule extends BaseRule {
  readonly id = 'QA003'
  readonly title = 'Empty Catch'

  async run(context: QaContext): Promise<QaResult[]> {
    const results: QaResult[] = []

    for (const file of context.files) {
      const blocks = BlockParser.findBlocks(file.content, 'catch')

      for (const block of blocks) {
        if (!BlockParser.isBodyEmpty(block.body)) {
          continue
        }

        const { line, column } = this.getLineAndColumn(
          file.content,
          block.bodyStart,
        )

        results.push({
          ruleId: this.id,
          severity: 'warning',
          file: file.path,
          line,
          column,
          message: 'Bloco catch vazio encontrado.',
          suggestion:
            'Registre a exceção, trate-a adequadamente ou propague o erro.',
        })
      }
    }

    return results
  }
}
