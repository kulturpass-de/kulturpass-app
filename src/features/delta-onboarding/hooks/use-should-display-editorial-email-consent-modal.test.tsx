import { renderHook } from '@testing-library/react-native'
import React from 'react'
import { Provider } from 'react-redux'
import { AccountInfo } from '../../../services/api/types'
import { RootState } from '../../../services/redux/configure-store'
import { configureMockStore } from '../../../services/testing/configure-mock-store'
import { useUserInfo } from '../../../services/user/use-user-info'
import { useShouldDisplayEditorialEmailConsentModal } from './use-should-display-editorial-email-consent-modal'

const mockUseUserInfo = useUserInfo as jest.Mock

jest.mock('../../../services/user/use-user-info')

describe('useShouldDisplayEditorialEmailConsentModal', () => {
  const authCdcState = {
    sessionToken: 'test',
    sessionSecret: 'test',
    sessionValidity: Date.now() + 10000,
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return false when user is not available or logged in, and no toggle flag is set', () => {
    mockUseUserInfo.mockReturnValueOnce({ accountInfo: { data: {} as AccountInfo } })
    const store = configureMockStore({})

    const { result } = renderHook(() => useShouldDisplayEditorialEmailConsentModal(), {
      wrapper: ({ children }) => <Provider store={store as any}>{children}</Provider>,
    })

    expect(result.current).toEqual(false)
  })

  it('should return false when user is not available or logged in, but toggle flag is set', () => {
    mockUseUserInfo.mockReturnValueOnce({ accountInfo: { data: {} as AccountInfo } })
    const store = configureMockStore({
      preloadedState: {
        auth: {
          cdc: authCdcState,
        },
        persisted: {
          deltaOnboarding: {
            showEditorialEmailModalOnStartup: true,
          },
        },
      } as RootState,
    })

    const { result } = renderHook(() => useShouldDisplayEditorialEmailConsentModal(), {
      wrapper: ({ children }) => <Provider store={store as any}>{children}</Provider>,
    })

    expect(result.current).toEqual(false)
  })

  it('should return false when user is available but not verified, and toggle flag is not set', () => {
    mockUseUserInfo.mockReturnValueOnce({ accountInfo: { data: { isVerified: false } as AccountInfo } })
    const store = configureMockStore({})

    const { result } = renderHook(() => useShouldDisplayEditorialEmailConsentModal(), {
      wrapper: ({ children }) => <Provider store={store as any}>{children}</Provider>,
    })

    expect(result.current).toEqual(false)
  })

  it('should return false when user is available and verified, but subscriptions consent declined, and toggle flag is not set', () => {
    mockUseUserInfo.mockReturnValueOnce({
      accountInfo: {
        data: {
          isVerified: true,
          subscriptions: { editorialInformation: { email: { isSubscribed: false } } },
        } as AccountInfo,
      },
    })
    const store = configureMockStore({})

    const { result } = renderHook(() => useShouldDisplayEditorialEmailConsentModal(), {
      wrapper: ({ children }) => <Provider store={store as any}>{children}</Provider>,
    })

    expect(result.current).toEqual(false)
  })

  it('should return false when user is available and verified, but subscriptions consent accepted, and toggle flag is not set', () => {
    mockUseUserInfo.mockReturnValueOnce({
      accountInfo: {
        data: {
          isVerified: true,
          subscriptions: { editorialInformation: { email: { isSubscribed: true } } },
        } as AccountInfo,
      },
    })
    const store = configureMockStore({})

    const { result } = renderHook(() => useShouldDisplayEditorialEmailConsentModal(), {
      wrapper: ({ children }) => <Provider store={store as any}>{children}</Provider>,
    })

    expect(result.current).toEqual(false)
  })

  it('should return true when user is available and verified, but no subscriptions consent set, and toggle flag is not set', () => {
    mockUseUserInfo.mockReturnValueOnce({ accountInfo: { data: { isVerified: true } as AccountInfo } })
    const store = configureMockStore({})

    const { result } = renderHook(() => useShouldDisplayEditorialEmailConsentModal(), {
      wrapper: ({ children }) => <Provider store={store as any}>{children}</Provider>,
    })

    expect(result.current).toEqual(true)
  })
})
