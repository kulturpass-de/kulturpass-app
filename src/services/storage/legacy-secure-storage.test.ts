import rnEncryptedStorage from 'react-native-encrypted-storage'
import { LegacySecureStorage } from './legacy-secure-storage'

const getItem = rnEncryptedStorage.getItem as jest.MockedFunction<(key: string) => Promise<string | null>>

test('Should return item', async () => {
  // @ts-expect-error Can't be undefined but we want to test the behaviour
  getItem.mockReturnValueOnce(Promise.resolve(undefined))
  expect(await LegacySecureStorage.getItem('')).toBe(null)

  getItem.mockReturnValueOnce(Promise.resolve(null))
  expect(await LegacySecureStorage.getItem('')).toBe(null)

  getItem.mockReturnValueOnce(Promise.resolve(''))
  expect(await LegacySecureStorage.getItem('')).toBe('')

  getItem.mockReturnValueOnce(Promise.resolve('{ "hello": "world" }'))
  expect(await LegacySecureStorage.getItem('')).toEqual({ hello: 'world' })
})
