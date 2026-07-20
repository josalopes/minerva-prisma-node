import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export type ReportFormat = 'txt' | 'md' | 'json' | 'html'

export class ReportWriter {
  private static readonly REPORTS_DIR = join(process.cwd(), 'reports')
  private static readonly HISTORY_DIR = join(
    ReportWriter.REPORTS_DIR,
    'history',
  )

  static async save(format: ReportFormat, output: string): Promise<void> {
    await mkdir(this.HISTORY_DIR, {
      recursive: true,
    })

    const timestamp = this.getTimestamp()

    await writeFile(join(this.REPORTS_DIR, `latest.${format}`), output, 'utf8')

    await writeFile(
      join(this.HISTORY_DIR, `${timestamp}.${format}`),
      output,
      'utf8',
    )
  }

  private static getTimestamp(): string {
    return new Date()
      .toISOString()
      .replace(/:/g, '-')
      .replace(/\..+/, '')
      .replace('T', '_')
  }
}
