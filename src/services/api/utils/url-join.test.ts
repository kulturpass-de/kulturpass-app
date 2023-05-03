import { urlJoin } from './url-join'

describe('url-join', () => {
  it('should join the given strings with a slash', async () => {
    expect(urlJoin('a', 'b', 'c')).toBe('a/b/c')
    expect(urlJoin('some', 'test')).toBe('some/test')
    expect(urlJoin('another', '')).toBe('another/')
    expect(urlJoin('', 'test')).toBe('/test')
  })
})
