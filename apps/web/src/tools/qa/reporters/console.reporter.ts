import { QaReport } from '../engine/qa-report'

export class ConsoleReporter {
  render(report: QaReport): string {
    const lines: string[] = []

    lines.push('══════════════════════════════════════')
    lines.push('          MINERVA QA')
    lines.push('══════════════════════════════════════')
    lines.push('')

    lines.push(`Arquivos analisados : ${report.filesScanned}`)
    lines.push(`Regras executadas   : ${report.rulesExecuted}`)
    lines.push(`Tempo               : ${report.durationMs} ms`)
    lines.push('')

    if (report.results.length === 0) {
      lines.push('✓ Nenhum problema encontrado.')
      return lines.join('\n')
    }

    for (const result of report.results) {
      lines.push(`[${result.ruleId}] ${result.severity.toUpperCase()}`)
      lines.push(`Arquivo : ${result.file}`)

      if (result.line !== undefined) {
        lines.push(`Linha   : ${result.line}:${result.column ?? 1}`)
      }

      lines.push(`Mensagem: ${result.message}`)

      if (result.suggestion) {
        lines.push(`Sugestão: ${result.suggestion}`)
      }

      lines.push('')
    }

    return lines.join('\n')
  }

  report(report: QaReport): void {
    process.stdout.write(this.render(report))
  }
}
