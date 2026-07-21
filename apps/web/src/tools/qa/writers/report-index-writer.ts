import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { QaReport } from '../engine/qa-report'
import { QaResult } from '../engine/qa-result'
import { groupResultsByRule } from '../utils/group-results-by-rule'

export class ReportIndexWriter {
  private static readonly REPORTS_DIR = join(process.cwd(), 'reports')

  static async save(report: QaReport): Promise<void> {
    await mkdir(this.REPORTS_DIR, {
      recursive: true,
    })

    // const grouped = this.groupByRule(report)
    const grouped = groupResultsByRule(report)

    const lines: string[] = []

    lines.push('# Minerva QA Report')
    lines.push('')
    lines.push(`Gerado em: ${this.formatDate()}`)
    lines.push('')

    lines.push('## Status')
    lines.push('')

    if (report.results.length === 0) {
      lines.push('✅ **Nenhum problema encontrado**')
    } else {
      lines.push(`⚠️ **${report.results.length} problemas encontrados**`)
    }

    lines.push('')
    lines.push('---')
    lines.push('')

    lines.push('## Resumo')
    lines.push('')
    lines.push(`- Arquivos analisados: **${report.filesScanned}**`)
    lines.push(`- Regras executadas: **${report.rulesExecuted}**`)
    lines.push(`- Tempo de execução: **${report.durationMs} ms**`)
    lines.push('')

    lines.push('---')
    lines.push('')

    lines.push('## Relatórios')
    lines.push('')
    lines.push('- 📄 [Relatório completo (Markdown)](latest.md)')
    lines.push('- 📋 [Relatório completo (JSON)](latest.json)')
    lines.push('')

    lines.push('---')
    lines.push('')

    lines.push('## Regras')
    lines.push('')

    lines.push('| Regra | Severidade | Ocorrências | Relatório |')
    lines.push('| ----- | ---------- | ----------: | --------- |')

    const entries = Object.entries(grouped).sort(
      ([, a], [, b]) => b.length - a.length,
    )

    for (const [ruleId, results] of entries) {
      lines.push(
        `| ${ruleId} | ${this.capitalize(results[0].severity)} | ${results.length} | [${ruleId}.md](rules/${ruleId}.md) |`,
      )
    }

    lines.push('')
    lines.push('---')
    lines.push('')
    lines.push('Gerado by **Minerva QA v0.1.0**')

    await writeFile(
      join(this.REPORTS_DIR, 'index.md'),
      lines.join('\n'),
      'utf8',
    )
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

  private static formatDate(date = new Date()): string {
    return date.toLocaleString('pt-BR')
  }

  private static capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
