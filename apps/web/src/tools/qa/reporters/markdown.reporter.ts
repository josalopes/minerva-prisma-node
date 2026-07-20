import { QaReport } from '../engine/qa-report'

export class MarkdownReporter {
  render(report: QaReport): string {
    const lines: string[] = []

    lines.push('# Minerva QA')
    lines.push('')

    lines.push('## Resumo')
    lines.push('')
    lines.push('| Item | Valor |')
    lines.push('| :--- | ----: |')
    lines.push(`| Arquivos analisados | ${report.filesScanned} |`)
    lines.push(`| Regras executadas | ${report.rulesExecuted} |`)
    lines.push(`| Tempo | ${report.durationMs} ms |`)
    lines.push('')

    if (report.results.length === 0) {
      lines.push('## Resultado')
      lines.push('')
      lines.push('✅ Nenhum problema encontrado.')
      lines.push('')

      return lines.join('\n')
    }

    lines.push('## Ocorrências')
    lines.push('')

    for (const result of report.results) {
      lines.push(`### ${result.ruleId}`)
      lines.push('')

      lines.push(`- **Severidade:** ${result.severity}`)
      lines.push(`- **Arquivo:** \`${result.file}\``)

      if (result.line !== undefined) {
        lines.push(`- **Linha:** ${result.line}:${result.column ?? 1}`)
      }

      lines.push(`- **Mensagem:** ${result.message}`)

      if (result.suggestion) {
        lines.push(`- **Sugestão:** ${result.suggestion}`)
      }

      lines.push('')
      lines.push('---')
      lines.push('')
    }

    return lines.join('\n')
  }
}
