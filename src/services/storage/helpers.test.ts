import { parseJsonIfValid, stringify } from './helpers'

describe('secure storage helper functions', () => {
  describe('parseJsonIfValid', () => {
    it('Should return json object if its valid json otherwise the passed argument', () => {
      expect(parseJsonIfValid(undefined!)).toBe(undefined)
      expect(parseJsonIfValid(null)).toBe(null)
      expect(parseJsonIfValid('')).toBe('')
      expect(parseJsonIfValid('text')).toBe('text')
      expect(parseJsonIfValid('{}')).toEqual({})
      expect(parseJsonIfValid('{ "hello": "world" }')).toEqual({ hello: 'world' })
    })
  })

  describe('stringify', () => {
    it('stringifies undefined', () => {
      expect(stringify(undefined)).toBe('')
    })
    it('stringifies null', () => {
      expect(stringify(null)).toBe('')
    })
    it('stringifies a string', () => {
      expect(stringify('test')).toBe('test')
    })
    it('stringifies a number', () => {
      expect(stringify(2)).toBe('2')
    })
    it('stringifies an object', () => {
      expect(stringify({ name: 'test' })).toBe('{"name":"test"}')
    })
  })
})
