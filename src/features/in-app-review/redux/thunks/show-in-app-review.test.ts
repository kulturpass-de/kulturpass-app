import InAppReview from 'react-native-in-app-review'
import { RootState } from '../../../../services/redux/configure-store'
import { configureMockStore } from '../../../../services/testing/configure-mock-store'
import { showInAppReview, TIMESTAMP_DIFF_TO_SHOW_NEXT_REVIEW } from './show-in-app-review'

jest.mock('react-native-in-app-review', () => ({
  __esModule: true,
  default: {
    RequestInAppReview: jest.fn(() => Promise.resolve(true)),
    isAvailable: jest.fn(() => true),
  },
}))

describe('showInAppReview', () => {
  beforeEach(() => {
    // Locally jest.resetMocks() broke one test
    InAppReview.isAvailable = jest.fn(() => true)
    InAppReview.RequestInAppReview = jest.fn(() => Promise.resolve(true))
  })

  test('should show inAppReview if not done before', async () => {
    const preloadedState = {
      persisted: {
        inAppReview: {
          lastShownTimestamp: undefined,
        },
      },
      inAppReview: {
        showInAppReview: true,
      },
    } as RootState
    const store = configureMockStore({
      middlewares: [],
      preloadedState,
    })

    await store.dispatch(showInAppReview())

    expect(InAppReview.isAvailable).toBeCalledTimes(1)
    expect(InAppReview.RequestInAppReview).toBeCalledTimes(1)
    const lastShownTimestamp = store.getState().persisted.inAppReview.lastShownTimestamp
    expect(lastShownTimestamp).toBeDefined()
    expect(lastShownTimestamp).toBeLessThanOrEqual(Date.now())
  })

  test('should show inAppReview if more 31 days ago', async () => {
    const previousTimestamp = Date.now() - TIMESTAMP_DIFF_TO_SHOW_NEXT_REVIEW - 60 * 1000
    const preloadedState = {
      persisted: {
        inAppReview: {
          lastShownTimestamp: previousTimestamp,
        },
      },
      inAppReview: {
        showInAppReview: true,
      },
    } as RootState
    const store = configureMockStore({
      middlewares: [],
      preloadedState,
    })

    await store.dispatch(showInAppReview())

    expect(InAppReview.isAvailable).toBeCalledTimes(1)
    expect(InAppReview.RequestInAppReview).toBeCalledTimes(1)
    const lastShownTimestamp = store.getState().persisted.inAppReview.lastShownTimestamp
    expect(lastShownTimestamp).toBeDefined()
    expect(lastShownTimestamp).toBeLessThanOrEqual(Date.now())
    expect(lastShownTimestamp).toBeGreaterThan(previousTimestamp)
  })

  test('should not show inAppReview if not 31 days ago', async () => {
    const previousTimestamp = Date.now() - 3600
    const preloadedState = {
      persisted: {
        inAppReview: {
          lastShownTimestamp: previousTimestamp,
        },
      },
      inAppReview: {
        showInAppReview: true,
      },
    } as RootState
    const store = configureMockStore({
      middlewares: [],
      preloadedState,
    })

    await store.dispatch(showInAppReview())

    expect(InAppReview.isAvailable).toBeCalledTimes(1)
    expect(InAppReview.RequestInAppReview).toBeCalledTimes(0)
    const lastShownTimestamp = store.getState().persisted.inAppReview.lastShownTimestamp
    expect(lastShownTimestamp).toBe(previousTimestamp)
  })

  test('should not show inAppReview if it is not available', async () => {
    const isAvailable = InAppReview.isAvailable as any
    isAvailable.mockImplementationOnce(() => false)
    const preloadedState = {
      persisted: {
        inAppReview: {
          lastShownTimestamp: undefined,
        },
      },
      inAppReview: {
        showInAppReview: true,
      },
    } as RootState
    const store = configureMockStore({
      middlewares: [],
      preloadedState,
    })

    await store.dispatch(showInAppReview())

    expect(InAppReview.isAvailable).toBeCalledTimes(1)
    expect(InAppReview.RequestInAppReview).toBeCalledTimes(0)
    const lastShownTimestamp = store.getState().persisted.inAppReview.lastShownTimestamp
    expect(lastShownTimestamp).toBe(undefined)
  })

  test('should still set timestamp if InAppReview errored', async () => {
    const RequestInAppReview = InAppReview.RequestInAppReview as any
    RequestInAppReview.mockImplementationOnce(() => Promise.reject(new Error('Test')))
    const preloadedState = {
      persisted: {
        inAppReview: {
          lastShownTimestamp: undefined,
        },
      },
      inAppReview: {
        showInAppReview: true,
      },
    } as RootState
    const store = configureMockStore({
      middlewares: [],
      preloadedState,
    })

    await store.dispatch(showInAppReview())

    expect(InAppReview.isAvailable).toBeCalledTimes(1)
    expect(InAppReview.RequestInAppReview).toBeCalledTimes(1)
    const lastShownTimestamp = store.getState().persisted.inAppReview.lastShownTimestamp
    expect(lastShownTimestamp).toBeDefined()
    expect(lastShownTimestamp).toBeLessThanOrEqual(Date.now())
  })

  test('should not show inAppReview if it is disabled', async () => {
    const isAvailable = InAppReview.isAvailable as any
    isAvailable.mockImplementationOnce(() => false)
    const preloadedState = {
      persisted: {
        inAppReview: {
          lastShownTimestamp: undefined,
        },
      },
      inAppReview: {
        showInAppReview: false,
      },
    } as RootState
    const store = configureMockStore({
      middlewares: [],
      preloadedState,
    })

    await store.dispatch(showInAppReview())

    expect(InAppReview.isAvailable).toBeCalledTimes(0)
    expect(InAppReview.RequestInAppReview).toBeCalledTimes(0)
    const lastShownTimestamp = store.getState().persisted.inAppReview.lastShownTimestamp
    expect(lastShownTimestamp).toBe(undefined)
  })
})
