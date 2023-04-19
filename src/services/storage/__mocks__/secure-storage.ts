const store: { [key in string]: any } = {}

const mockItem = (key: string, value: any) => {
  store[key] = value
}

const createSecureStorage = () => {
  const getItem = async (key: string) => {
    return store[key]
  }

  const setItem = async (key: string, value: any) => {
    store[key] = value
  }

  const removeItem = async (key: string) => {
    delete store[key]
  }

  return { getItem, setItem, removeItem }
}

export const mockedSecureStorage = { store, mockItem, createSecureStorage }

exports.createSecureStorage = createSecureStorage
