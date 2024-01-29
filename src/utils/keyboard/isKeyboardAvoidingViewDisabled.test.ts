import { Platform } from 'react-native'
import { getSystemVersion } from 'react-native-device-info'
import { isKeyboardAvoidingViewDisabled } from './isKeyboardAvoidingViewDisabled'

const mockedGetSystemVersion = getSystemVersion as jest.Mock<any>

describe('isKeyboardAvoidingViewDisabled', () => {
  beforeAll(() => {
    // tests cover ios per default
    Platform.OS = 'ios'
  })

  afterAll(() => jest.clearAllMocks())

  test.each<[boolean, string]>([
    [true, '16.4.5'],
    [true, '16.4'],
    [true, '16'],
    [true, '15.5'],
    [true, '15.5.1'],
    [false, '17'],
    [false, '17.2'],
    [false, '17.2.1'],
    [false, '18'],
    [false, '18.1'],
    [false, '18.2'],
  ])('should return %s for iOS version = %s', (expected, input) => {
    mockedGetSystemVersion.mockReturnValue(input)
    expect(isKeyboardAvoidingViewDisabled()).toEqual(expected)
  })

  it('should return false for Android version 16.4', () => {
    Platform.OS = 'android'
    mockedGetSystemVersion.mockReturnValue('16.4')
    expect(isKeyboardAvoidingViewDisabled()).toEqual(false)
  })

  it('should return false for Android version 17.2', () => {
    Platform.OS = 'android'
    mockedGetSystemVersion.mockReturnValue('17.2')
    expect(isKeyboardAvoidingViewDisabled()).toEqual(false)
  })
})
