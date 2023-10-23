import { decodeBase64Url, parseBaseUrl64Location } from './utils'

const testData = [
  { utf8: 'Hel', base64url: 'SGVs' }, // base64 padding 0
  { utf8: 'Hello', base64url: 'SGVsbG8' }, // base64 padding 1
  { utf8: 'Hell', base64url: 'SGVsbA' }, // base64 padding 2
  { utf8: 'Hello World', base64url: 'SGVsbG8gV29ybGQ' },
  { utf8: 'Hello World$$', base64url: 'SGVsbG8gV29ybGQkJA' },
  { utf8: 'Hello$$_? World$$', base64url: 'SGVsbG8kJF8_IFdvcmxkJCQ' }, // base64 with /
  { utf8: 'Hello~😄$$$$$$$$$$____? World$$', base64url: 'SGVsbG9-8J-YhCQkJCQkJCQkJCRfX19fPyBXb3JsZCQk' }, // base64 with +
]

describe('utils', () => {
  describe('decodeBase64Url', () => {
    testData.forEach(({ utf8, base64url }) => {
      it(`decodes '${base64url}' to utf8`, () => {
        const act = decodeBase64Url(base64url)
        expect(act).toBe(utf8)
      })
    })
  })

  describe('parseBaseUrl64Location', () => {
    it('parse valid location string successful', () => {
      const base64UrlValue =
        'eyJpZCI6Ijc2MDI1NjAiLCJpbmZvIjoiQnJhbmRlbmJ1cmciLCJsYXRpdHVkZSI6NTIuMzk4ODYsImxvbmdpdHVkZSI6MTMuMDY1NjYsIm5hbWUiOiJQb3RzZGFtIn0'

      const location = parseBaseUrl64Location(base64UrlValue)

      expect(location).toMatchObject({ id: '7602560', latitude: 52.39886, longitude: 13.06566, name: 'Potsdam' })
    })

    it('should not parse invalid JSON', () => {
      const base64UrlValue = 'Tm9uIEpzb24gc3RyaW5n'

      const location = parseBaseUrl64Location(base64UrlValue)

      expect(location).toBeNull()
    })

    it('should not parse invalid location object', () => {
      const base64UrlValue = 'eyJuYW1lIjogInNvbWV0aGluZyIsICJ0ZXN0IjogMC40MjE0fQ'

      const location = parseBaseUrl64Location(base64UrlValue)

      expect(location).toBeNull()
    })
  })
})
