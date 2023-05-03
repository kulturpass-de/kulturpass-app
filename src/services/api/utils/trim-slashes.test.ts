import { trimSlashes } from './trim-slashes'

describe('trim-slashes', () => {
  it('should trim slashes from beginning and end of the given input string', async () => {
    expect(trimSlashes('test0')).toBe('test0')
    expect(trimSlashes('test1/')).toBe('test1')
    expect(trimSlashes('/test2')).toBe('test2')
    expect(trimSlashes('/test3/')).toBe('test3')
    expect(trimSlashes('/te/st4/')).toBe('te/st4')
    expect(trimSlashes('///////')).toBe('')
    expect(trimSlashes('/')).toBe('')
    expect(trimSlashes('')).toBe('')
  })
})
