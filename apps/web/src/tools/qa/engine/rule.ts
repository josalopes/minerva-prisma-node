import { QaContext } from './qa-context'
import { QaResult } from './qa-result'

export interface QaRule {
  /**
   * Identificador único da regra.
   *
   * Ex:
   * QA001
   */
  id: string

  /**
   * Nome amigável.
   */
  title: string

  /**
   * Executa a regra.
   */
  run(context: QaContext): Promise<QaResult[]>
}
