import { renderHook } from '@testing-library/react-native'
import { useHandleWebviewErrors } from './use-handle-webview-errors'
import { Platform } from 'react-native'
import { act } from 'react-test-renderer'
import { ERR_NO_INTERNET } from '../components/webview-error-view'

describe('useHandleWebviewErrors', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should handle error accordingly on ios', async () => {
    Platform.OS = 'ios'

    const { result } = renderHook(() => useHandleWebviewErrors())

    expect(result.current.errorCode).toBeUndefined()

    await act(() => result.current.handleError({ nativeEvent: { code: -1009, description: 'Test string' } } as any))

    expect(result.current.errorCode).toBe(ERR_NO_INTERNET)

    await act(() => result.current.resetError())

    expect(result.current.errorCode).toBeUndefined()

    await act(() => result.current.handleError({ nativeEvent: { code: -1234, description: 'Test string' } } as any))

    expect(result.current.errorCode).toBe(-1234)

    await act(() =>
      result.current.handleHttpError({ nativeEvent: { statusCode: 404, description: 'Test string' } } as any),
    )

    expect(result.current.errorCode).toBe(404)
  })

  test('should handle error accordingly on android', async () => {
    Platform.OS = 'android'

    const { result } = renderHook(() => useHandleWebviewErrors())

    expect(result.current.errorCode).toBeUndefined()

    await act(() =>
      result.current.handleError({ nativeEvent: { code: -2, description: 'net::ERR_INTERNET_DISCONNECTED' } } as any),
    )

    expect(result.current.errorCode).toBe(ERR_NO_INTERNET)

    await act(() => result.current.resetError())

    expect(result.current.errorCode).toBeUndefined()

    await act(() => result.current.handleError({ nativeEvent: { code: -1234, description: 'Test string' } } as any))

    expect(result.current.errorCode).toBe(-1234)

    await act(() =>
      result.current.handleHttpError({ nativeEvent: { statusCode: 404, description: 'Test string' } } as any),
    )

    expect(result.current.errorCode).toBe(404)
  })
})
