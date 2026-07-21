import { describe, expect, it } from 'vitest'
import { BlockParser } from './block-parser'

describe('BlockParser.findBlocks()', () => {
  it('should find a simple catch block', () => {
    const code = `
try {
  foo();
} catch (err) {
}
`

    const blocks = BlockParser.findBlocks(code, 'catch')

    expect(blocks).toHaveLength(1)
    expect(blocks[0].keyword).toBe('catch')
    expect(blocks[0].body.trim()).toBe('')
  })

  it('should find multiple catch blocks', () => {
    const code = `
      try {} catch {}

      try {} catch (err) {
          logger.error(err);
      }
      `

    const blocks = BlockParser.findBlocks(code, 'catch')

    expect(blocks).toHaveLength(2)
  })

  it('should preserve block body', () => {
    const code = `
      try {
      } catch (err) {
          logger.error(err);
      }
      `

    const blocks = BlockParser.findBlocks(code, 'catch')

    expect(blocks[0].body).toContain('logger.error')
  })

  it('should support nested braces', () => {
    const code = `
      try {
      } catch (err) {
          if (true) {
              foo();
          }
      }
`

    const blocks = BlockParser.findBlocks(code, 'catch')

    expect(blocks).toHaveLength(1)
    expect(blocks[0].body).toContain('foo()')
  })
})

describe('BlockParser.isBodyEmpty()', () => {
  it('should return true for empty body', () => {
    expect(BlockParser.isBodyEmpty('')).toBe(true)
  })

  it('should ignore whitespace', () => {
    expect(
      BlockParser.isBodyEmpty(`


      `),
    ).toBe(true)
  })

  it('should ignore single line comments', () => {
    expect(
      BlockParser.isBodyEmpty(`
        // TODO
      `),
    ).toBe(true)
  })

  it('should ignore multi-line comments', () => {
    expect(
      BlockParser.isBodyEmpty(`
        /*
         * comentário
         */
      `),
    ).toBe(true)
  })

  it('should detect executable code', () => {
    expect(
      BlockParser.isBodyEmpty(`
        console.error(err);
      `),
    ).toBe(false)
  })

  it('should detect throw statement', () => {
    expect(
      BlockParser.isBodyEmpty(`
        throw err;
      `),
    ).toBe(false)
  })

  it('should detect return statement', () => {
    expect(
      BlockParser.isBodyEmpty(`
        return;
      `),
    ).toBe(false)
  })

  it('should detect logger call', () => {
    expect(
      BlockParser.isBodyEmpty(`
        logger.error(err);
      `),
    ).toBe(false)
  })

  it('should support catch without parameter', () => {
    const code = `
      try {
      } catch {
      }
    `

    const blocks = BlockParser.findBlocks(code, 'catch')

    expect(blocks).toHaveLength(1)
  })

  it('should parse deeply nested blocks', () => {
    const code = `
  try {
  } catch (err) {
      if (a) {
          while (b) {
              foo();
          }
      }
  }
  `

    const blocks = BlockParser.findBlocks(code, 'catch')

    expect(blocks).toHaveLength(1)
    expect(blocks[0].body).toContain('while')
  })
})
