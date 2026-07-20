import { QaContext } from '../engine/qa-context'
import { QaResult } from '../engine/qa-result'
import { QaRule } from '../engine/rule'

export abstract class BaseRule implements QaRule {
  abstract id: string

  abstract title: string

  abstract run(context: QaContext): Promise<QaResult[]>
}
