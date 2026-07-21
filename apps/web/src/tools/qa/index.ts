import { QaEngine } from './engine/qa-engine'
import { QaReport } from './engine/qa-report'

import { Scanner } from './scanner'

import { defaultRules } from './rules'

import { ConsoleReporter } from './reporters'
import { JsonReporter } from './reporters/json.reporter'
import { MarkdownReporter } from './reporters/markdown.reporter'

import { ReportWriter } from './writers/report-writer'
import { RuleReportWriter } from './writers/rule-report-writer'

async function main() {
  console.clear()

  // Scan
  const scanner = new Scanner({
    rootDir: process.cwd(),
  })

  const files = await scanner.scan()

  // Engine
  const engine = new QaEngine()

  for (const rule of defaultRules) {
    engine.register(rule)
  }

  // Execute
  const startedAt = performance.now()

  const results = await engine.run({
    files,
  })

  // Report
  const report: QaReport = {
    filesScanned: files.length,
    rulesExecuted: engine.getRules().length,
    durationMs: Math.round(performance.now() - startedAt),
    results,
  }

  // Render
  const consoleReporter = new ConsoleReporter()
  const markdownReporter = new MarkdownReporter()
  const jsonReporter = new JsonReporter()

  const txt = consoleReporter.render(report)
  const md = markdownReporter.render(report)
  const json = jsonReporter.render(report)

  // Save consolidated reports
  await ReportWriter.save('txt', txt)
  await ReportWriter.save('md', md)
  await ReportWriter.save('json', json)

  // Save reports grouped by rule
  await RuleReportWriter.save(report)

  // Console output
  process.stdout.write(txt)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
