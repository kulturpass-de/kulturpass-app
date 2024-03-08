import { TextStyle } from 'react-native'
import { transformToBolderFontWeight } from './typography'
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

  describe('transformToBolderFontWeight', () => {
    test.each<[TextStyle['fontWeight'], TextStyle['fontWeight']]>([
      ['100', '300'],
      ['200', '400'],
      ['300', '500'],
      ['400', '600'],
      ['500', '700'],
      ['600', '800'],
      ['700', '900'],
      ['800', '900'],
      ['900', '900'],
      ['normal', 'bold'],
      ['bold', 'bold'],
    ])('should transform %s into %s', (input, expected) => {
      expect(transformToBolderFontWeight(input)).toStrictEqual(expected)
    })
  })
})
