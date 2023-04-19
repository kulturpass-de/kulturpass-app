import { buildUrl } from './api'

test('Should build url', () => {
  const expected = 'http://localhost/relative/path'

  expect(buildUrl('http://localhost', '/relative/path')).toBe(expected)
  expect(buildUrl('http://localhost/', 'relative/path')).toBe(expected)
  expect(buildUrl('http://localhost', 'relative/path')).toBe(expected)
  expect(buildUrl('http://localhost/', '/relative/path')).toBe(expected)
})
