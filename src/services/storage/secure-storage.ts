import rnEncryptedStorage from 'react-native-encrypted-storage'

export const createSecureStorage = <Value extends {}>() => {
  const getItem = async <Key extends Extract<keyof Value, string>>(key: Key) => {
    const result = await rnEncryptedStorage.getItem(key)

    if (!result) {
      return null
    }

    const parsed: Value[Key] = JSON.parse(result)
    return parsed
  }

  const setItem = async <Key extends Extract<keyof Value, string>>(key: Key, value: Value[Key]) => {
    const stringified = JSON.stringify(value)
    await rnEncryptedStorage.setItem(key, stringified)
  }

  const removeItem = async <Key extends Extract<keyof Value, string>>(key: Key) => {
    const existing = await getItem(key)
    if (existing !== null) {
      await rnEncryptedStorage.removeItem(key)
    }
  }

  return { getItem, setItem, removeItem }
}
