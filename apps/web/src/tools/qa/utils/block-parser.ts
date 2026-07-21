export interface CodeBlock {
  keyword: string

  start: number
  end: number

  bodyStart: number
  bodyEnd: number

  header: string
  body: string
}

export class BlockParser {
  static findBlocks(content: string, keyword: string): CodeBlock[] {
    const blocks: CodeBlock[] = []

    const regex = new RegExp(`\\b${keyword}\\b`, 'g')

    let match: RegExpExecArray | null

    while ((match = regex.exec(content)) !== null) {
      const openBrace = content.indexOf('{', match.index)

      if (openBrace === -1) {
        continue
      }

      let depth = 1
      let i = openBrace + 1

      while (i < content.length && depth > 0) {
        if (content[i] === '{') {
          depth++
        } else if (content[i] === '}') {
          depth--
        }

        i++
      }

      if (depth !== 0) {
        continue
      }

      blocks.push({
        keyword,
        start: match.index,
        end: i - 1,

        bodyStart: openBrace + 1,
        bodyEnd: i - 1,

        header: content.slice(match.index, openBrace),
        body: content.slice(openBrace + 1, i - 1),
      })
    }

    return blocks
  }

  static isBodyEmpty(body: string): boolean {
    const cleaned = body
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim()

    return cleaned.length === 0
  }
}
