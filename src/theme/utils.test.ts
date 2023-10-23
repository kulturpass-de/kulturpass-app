import { toTransparentColor } from './utils'

describe('theme utils', () => {
  describe('toTransparentColor', () => {
    test('should return correct transparent color', () => {
      const color = '#FFFFFF'
      expect(toTransparentColor(color, 1.0)).toBe(color + 'FF')
      expect(toTransparentColor(color, 0.0)).toBe(color + '00')
      expect(toTransparentColor(color, 0.5)).toBe(color + '7F')
      expect(toTransparentColor(color, 0.4)).toBe(color + '66')
    })

    test('should return color', () => {
      const color = '#FFFFFF'
      expect(toTransparentColor(color, 0.5, false)).toBe(color)
    })
  })
})
