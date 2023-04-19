export type StorageProvider = {
  getItem: (key: string) => Promise<string | Object | null>
  setItem: (key: string, value: string | Object) => Promise<void>
  removeItem: (key: string) => Promise<void>
}
