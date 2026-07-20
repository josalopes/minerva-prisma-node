import { promises as fs } from 'node:fs'
import path from 'node:path'

import { QaFile } from '../engine/qa-context'
import { ScannerOptions } from './scanner-options'

const DEFAULT_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']

const DEFAULT_EXCLUDED_DIRECTORIES = [
  '.git',
  '.next',
  'node_modules',
  'dist',
  'build',
  'coverage',
  'out',
]

export class Scanner {
  constructor(private readonly options: ScannerOptions) {}

  async scan(): Promise<QaFile[]> {
    const files: QaFile[] = []

    await this.walk(this.options.rootDir, files)

    return files
  }

  private async walk(directory: string, files: QaFile[]): Promise<void> {
    const entries = await fs.readdir(directory, {
      withFileTypes: true,
    })

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        if (this.isExcludedDirectory(entry.name)) {
          continue
        }

        await this.walk(fullPath, files)

        continue
      }

      if (!this.hasValidExtension(fullPath)) {
        continue
      }

      const content = await fs.readFile(fullPath, 'utf8')

      files.push({
        path: fullPath,
        name: path.basename(fullPath),
        extension: path.extname(fullPath),
        directory: path.dirname(fullPath),
        content,
      })
    }
  }

  private hasValidExtension(file: string) {
    const extensions = this.options.includeExtensions ?? DEFAULT_EXTENSIONS

    return extensions.some((ext) => file.endsWith(ext))
  }

  private isExcludedDirectory(directory: string) {
    const excluded =
      this.options.excludeDirectories ?? DEFAULT_EXCLUDED_DIRECTORIES

    return excluded.includes(directory)
  }
}
