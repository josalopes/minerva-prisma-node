import { QaContext } from './qa-context'
import { QaResult } from './qa-result'
import { QaRule } from './rule'

export class QaEngine {
  private readonly rules: QaRule[] = []

  register(rule: QaRule) {
    this.rules.push(rule)
  }

  async run(context: QaContext): Promise<QaResult[]> {
    const results: QaResult[] = []

    for (const rule of this.rules) {
      try {
        const ruleResults = await rule.run(context)

        results.push(...ruleResults)
      } catch (error) {
        results.push({
          ruleId: rule.id,
          severity: 'error',
          file: '',
          message: `Falha ao executar a regra "${rule.title}".`,
          suggestion: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return results
  }

  getRules() {
    return [...this.rules]
  }
}
