import { QaEngine } from './engine/qa-engine'
import { Scanner } from './scanner'
import { NoConsoleRule, TodoCommentsRule } from './rules'
import { ConsoleReporter } from './reporters'
import { QaReport } from './engine/qa-report'
import { ReportWriter } from './writers/report-writer'
import { JsonReporter } from './reporters/json.reporter'
import { MarkdownReporter } from './reporters/markdown.reporter'

async function main() {
  console.clear()

  const scanner = new Scanner({
    rootDir: process.cwd(),
  })

  const files = await scanner.scan()

  const engine = new QaEngine()

  engine.register(new NoConsoleRule())
  engine.register(new TodoCommentsRule())

  const startedAt = performance.now()

  const results = await engine.run({
    files,
  })

  const report: QaReport = {
    filesScanned: files.length,
    rulesExecuted: engine.getRules().length,
    durationMs: Math.round(performance.now() - startedAt),
    results,
  }

  const txt = new ConsoleReporter().render(report)
  const md = new MarkdownReporter().render(report)
  const json = new JsonReporter().render(report)

  await ReportWriter.save('txt', txt)
  await ReportWriter.save('md', md)
  await ReportWriter.save('json', json)

  process.stdout.write(txt)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
