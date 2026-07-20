import { QaContext } from '../engine/qa-context'
import { QaResult } from '../engine/qa-result'
import { QaRule } from '../engine/rule'

export abstract class BaseRule implements QaRule {
  abstract readonly id: string
  abstract readonly title: string

  abstract run(context: QaContext): Promise<QaResult[]>

  protected getLineAndColumn(
    content: string,
    index: number,
  ): {
    line: number
    column: number
  } {
    const before = content.slice(0, index)
    const lines = before.split('\n')

    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    }
  }
}
