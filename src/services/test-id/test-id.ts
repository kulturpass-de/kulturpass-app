import DeviceInfo from 'react-native-device-info'

export type TestId = string
export type TestIdBuilder = (uniqueToken: string) => TestId
export type AddTestIdModifier = (testId: TestId, modifier: string) => TestId

export type UseTestIdBuilderResult = {
  buildTestId: TestIdBuilder
  addTestIdModifier: AddTestIdModifier
}

const bundleId = DeviceInfo.getBundleId()

export const buildTestId: TestIdBuilder = (uniqueToken: string): TestId => `${bundleId}:id/${uniqueToken}`
export const addTestIdModifier: AddTestIdModifier = (testId: TestId, modifier: string) => `${testId}_${modifier}`

const useTestIdBuilderResult: UseTestIdBuilderResult = {
  buildTestId,
  addTestIdModifier,
}

export const useTestIdBuilder = () => useTestIdBuilderResult
