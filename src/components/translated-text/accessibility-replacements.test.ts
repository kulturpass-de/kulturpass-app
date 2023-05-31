import { applyAccessibilityReplacements } from './accessibility-replacements'

describe('accessibility-replacements', () => {
  it('should handle html tags', () => {
    const text = '<bold>first</bold>\n<italic><bold>second</bold></italic> <italic>third</italic>'
    expect(applyAccessibilityReplacements(text)).toBe('first\nsecond third')
  })

  it('should handle replacement strings', () => {
    const text = '100€\n200 € and 400.00 €'
    expect(applyAccessibilityReplacements(text)).toBe('100Euro\n200 Euro and 400.00 Euro')
  })
})
