import rnEncryptedStorage from 'react-native-encrypted-storage'

import { createSecureStorage } from './secure-storage'

describe('create-secure-storage', () => {
  const secureStorage = createSecureStorage<{ my_key: 'my_value' }>()

  const getItem = rnEncryptedStorage.getItem as jest.MockedFunction<(key: string) => Promise<string | null>>

  it('should return item', async () => {
    // @ts-expect-error Can't be undefined but we want to test the behaviour
    getItem.mockReturnValueOnce(Promise.resolve(undefined))
    expect(await secureStorage.getItem('my_key')).toBe(null)

    getItem.mockReturnValueOnce(Promise.resolve(null))
    expect(await secureStorage.getItem('my_key')).toBe(null)

    getItem.mockReturnValueOnce(Promise.resolve('""'))
    expect(await secureStorage.getItem('my_key')).toBe('')

    getItem.mockReturnValueOnce(Promise.resolve('{ "hello": "world" }'))
    expect(await secureStorage.getItem('my_key')).toEqual({ hello: 'world' })
  })
})
