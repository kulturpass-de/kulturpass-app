import {
  AA2CommandService,
  AA2Messages,
  AA2WorkflowHelper,
  AccessRights,
  Auth,
  BadState,
  Certificate,
  ChangePin,
  EnterCan,
  EnterNewPin,
  EnterPin,
  EnterPuk,
  InsertCard,
  Invalid,
  Status,
  TimeoutError,
  WorkflowMessages,
} from '@sap/react-native-ausweisapp2-wrapper'
import { waitFor } from '@testing-library/react-native'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { Platform } from 'react-native'
import { env } from '../../../env'
import { cdcApi } from '../../../services/api/cdc-api'
import { ErrorWithCode } from '../../../services/errors/errors'
import { RootState } from '../../../services/redux/configure-store'
import { configureMockStore } from '../../../services/testing/configure-mock-store'
import { AA2_TIMEOUTS } from '../eid-command-timeouts'
import {
  AA2AcceptTimeout,
  AA2CardDeactivated,
  AA2InitError,
  AA2SetPinTimeout,
  AA2Timeout,
  AA2BelowMinYearOfBirth,
  AA2BelowMinAge,
  AA2ForeignResidency,
  AA2PseudonymAlreadyInUse,
  AA2AuthError,
} from '../errors'
import { EidFlowResponse } from '../types'
import { eidAusweisApp2Service } from './eid-ausweisapp2-service'

jest.useFakeTimers()

const messages: WorkflowMessages = {
  sessionStarted: 'STARTED',
  sessionInProgress: 'IN_PROGRESS',
  sessionFailed: 'FAILED',
  sessionSucceeded: 'SUCCEEDED',
}

describe('EidAusweisApp2Service', () => {
  const server = setupServer()

  const mockServer = (status = 200) => {
    server.use(
      http.post('*/accounts.getAccountInfo', () => HttpResponse.json({ id_token: 'test-id-token' }, { status })),
    )
  }

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
  })
  afterAll(() => server.close())

  describe('initAA2Sdk', () => {
    test('should init the AA2 SDK if it is not running', async () => {
      const isRunningMock = jest.spyOn(AA2CommandService, 'isRunning').mockImplementation(() => Promise.resolve(false))
      const initMock = jest.spyOn(AA2WorkflowHelper, 'initializeAA2Sdk').mockImplementation(() => Promise.resolve())

      const result = await eidAusweisApp2Service.initAA2Sdk()

      expect(result.response).toBe(EidFlowResponse.EidSDKInitSuccess)
      expect(isRunningMock).toHaveBeenCalledTimes(1)
      expect(initMock).toHaveBeenCalledTimes(1)
      expect(initMock).toHaveBeenCalledWith(
        env.AA2_DEVELOPER_MODE,
        2,
        AA2_TIMEOUTS.INIT,
        AA2_TIMEOUTS.GET_SET_API_LEVEL,
      )
    })

    test('should not init the AA2 SDK if it is already running', async () => {
      const isRunningMock = jest.spyOn(AA2CommandService, 'isRunning').mockImplementation(() => Promise.resolve(true))
      const initMock = jest.spyOn(AA2WorkflowHelper, 'initializeAA2Sdk').mockImplementation(() => Promise.resolve())

      const result = await eidAusweisApp2Service.initAA2Sdk()

      expect(result.response).toBe(EidFlowResponse.EidSDKInitSuccess)
      expect(isRunningMock).toHaveBeenCalledTimes(1)
      expect(initMock).not.toHaveBeenCalled()
    })

    test('should error if init errors', async () => {
      const isRunningMock = jest.spyOn(AA2CommandService, 'isRunning').mockImplementation(() => Promise.resolve(false))
      const initMock = jest
        .spyOn(AA2WorkflowHelper, 'initializeAA2Sdk')
        .mockImplementationOnce(() => Promise.reject(new TimeoutError()))

      await expect(eidAusweisApp2Service.initAA2Sdk()).rejects.toBeInstanceOf(AA2Timeout)

      initMock.mockImplementationOnce(() => Promise.reject(new Error()))

      await expect(eidAusweisApp2Service.initAA2Sdk()).rejects.toBeInstanceOf(AA2InitError)

      initMock.mockImplementationOnce(() => Promise.reject({ msg: AA2Messages.BadState, error: 'Test' } as BadState))
      expect((await eidAusweisApp2Service.initAA2Sdk()).response).toBe(EidFlowResponse.EidMessageError)
      expect(isRunningMock).toHaveBeenCalledTimes(3)
      expect(initMock).toHaveBeenCalledTimes(3)
    })
  })

  describe('startAA2AuthFlow', () => {
    test('should start AA2 Auth flow', async () => {
      mockServer()

      const readerIsAvailableMock = jest
        .spyOn(AA2WorkflowHelper, 'readerIsAvailable')
        .mockImplementationOnce(() => Promise.resolve(true))
      const mockAccessRights: AccessRights = {
        msg: AA2Messages.AccessRights,
        chat: {
          optional: [],
          effective: [],
          required: [],
        },
      }
      const runAuthMock = jest
        .spyOn(AA2CommandService, 'runAuth')
        .mockImplementation(() => Promise.resolve(mockAccessRights))
      const mockCertificate: Certificate = {
        msg: AA2Messages.Certificate,
      } as any
      const getCertificateMock = jest
        .spyOn(AA2CommandService, 'getCertificate')
        .mockImplementation(() => Promise.resolve(mockCertificate))

      const tcTokenUrlSubdomains = ['test-subdom']
      const preloadedState = {
        auth: {
          cdc: {
            idToken: 'my_id_token',
            sessionToken: 'my_session_token',
            sessionSecret: 'my_session_secret',
            sessionValidity: -2,
          },
          commerce: {
            access_token: 'my_access_token',
          },
        },
        persisted: {
          cardSimulation: {
            simulateCard: false,
          },
          persistedAppCore: {
            appConfig: {
              eid: {
                tcTokenUrlSubdomains: tcTokenUrlSubdomains,
              },
            },
          },
        },
      } as RootState

      const store = configureMockStore({ middlewares: [cdcApi.middleware], preloadedState })

      const result = await store.dispatch(eidAusweisApp2Service.startAA2AuthFlow({ messages })).unwrap()

      expect(result.response).toBe(EidFlowResponse.EidAuthFlowStarted)
      expect((result as any).accessRights).toBe(mockAccessRights)
      expect((result as any).certificate).toBe(mockCertificate)

      expect(readerIsAvailableMock).toBeCalledTimes(1)
      expect(runAuthMock).toBeCalledTimes(1)
      expect(getCertificateMock).toBeCalledTimes(1)
    })

    test('should return NFC not available when no reader is available', async () => {
      const readerIsAvailableMock = jest
        .spyOn(AA2WorkflowHelper, 'readerIsAvailable')
        .mockImplementationOnce(() => Promise.resolve(false))

      const store = configureMockStore({ middlewares: [cdcApi.middleware] })

      const result = await store.dispatch(eidAusweisApp2Service.startAA2AuthFlow({ messages })).unwrap()

      expect(result.response).toBe(EidFlowResponse.EidNFCNotSupported)
      expect(readerIsAvailableMock).toBeCalledTimes(1)
    })

    test('should fail with AA2InitError if creating tcTokenUrl failed with forbidden', async () => {
      mockServer(403)

      const readerIsAvailableMock = jest
        .spyOn(AA2WorkflowHelper, 'readerIsAvailable')
        .mockImplementationOnce(() => Promise.resolve(true))

      const tcTokenUrlSubdomains = ['test-subdom']
      const preloadedState = {
        auth: {
          cdc: {
            idToken: 'my_id_token',
            sessionToken: 'my_session_token',
            sessionSecret: 'my_session_secret',
            sessionValidity: -2,
          },
          commerce: {
            access_token: 'my_access_token',
          },
        },
        persisted: {
          cardSimulation: {
            simulateCard: false,
          },
          persistedAppCore: {
            appConfig: {
              eid: {
                tcTokenUrlSubdomains: tcTokenUrlSubdomains,
              },
            },
          },
        },
      } as RootState

      const store = configureMockStore({ middlewares: [cdcApi.middleware], preloadedState })

      await expect(
        store.dispatch(eidAusweisApp2Service.startAA2AuthFlow({ messages })).unwrap(),
      ).rejects.toBeInstanceOf(AA2InitError)

      expect(readerIsAvailableMock).toBeCalledTimes(1)
    })

    test('should fail with AA2InitError if creating tcTokenUrl failed', async () => {
      mockServer(404)

      const readerIsAvailableMock = jest
        .spyOn(AA2WorkflowHelper, 'readerIsAvailable')
        .mockImplementationOnce(() => Promise.resolve(true))

      const tcTokenUrlSubdomains = ['test-subdom']
      const preloadedState = {
        auth: {
          cdc: {
            idToken: 'my_id_token',
            sessionToken: 'my_session_token',
            sessionSecret: 'my_session_secret',
            sessionValidity: -2,
          },
          commerce: {
            access_token: 'my_access_token',
          },
        },
        persisted: {
          cardSimulation: {
            simulateCard: false,
          },
          persistedAppCore: {
            appConfig: {
              eid: {
                tcTokenUrlSubdomains: tcTokenUrlSubdomains,
              },
            },
          },
        },
      } as RootState

      const store = configureMockStore({ middlewares: [cdcApi.middleware], preloadedState })

      await expect(
        store.dispatch(eidAusweisApp2Service.startAA2AuthFlow({ messages })).unwrap(),
      ).rejects.toBeInstanceOf(ErrorWithCode)

      expect(readerIsAvailableMock).toBeCalledTimes(1)
    })

    test('should should fail with AA2TimeoutError if timeout occured', async () => {
      mockServer()

      const readerIsAvailableMock = jest
        .spyOn(AA2WorkflowHelper, 'readerIsAvailable')
        .mockImplementationOnce(() => Promise.resolve(true))
      const runAuthMock = jest
        .spyOn(AA2CommandService, 'runAuth')
        .mockImplementation(() => Promise.reject(new TimeoutError()))

      const tcTokenUrlSubdomains = ['test-subdom']
      const preloadedState = {
        auth: {
          cdc: {
            idToken: 'my_id_token',
            sessionToken: 'my_session_token',
            sessionSecret: 'my_session_secret',
            sessionValidity: -2,
          },
          commerce: {
            access_token: 'my_access_token',
          },
        },
        persisted: {
          cardSimulation: {
            simulateCard: false,
          },
          persistedAppCore: {
            appConfig: {
              eid: {
                tcTokenUrlSubdomains: tcTokenUrlSubdomains,
              },
            },
          },
        },
      } as RootState

      const store = configureMockStore({ middlewares: [cdcApi.middleware], preloadedState })

      await expect(
        store.dispatch(eidAusweisApp2Service.startAA2AuthFlow({ messages })).unwrap(),
      ).rejects.toBeInstanceOf(AA2Timeout)

      expect(readerIsAvailableMock).toBeCalledTimes(1)
      expect(runAuthMock).toBeCalledTimes(1)
    })

    test('should return early without throwing if message error occured', async () => {
      mockServer()

      const readerIsAvailableMock = jest
        .spyOn(AA2WorkflowHelper, 'readerIsAvailable')
        .mockImplementationOnce(() => Promise.resolve(true))

      const mockedBadState: BadState = {
        msg: AA2Messages.BadState,
        error: 'Some test error',
      }
      const runAuthMock = jest
        .spyOn(AA2CommandService, 'runAuth')
        .mockImplementation(() => Promise.reject(mockedBadState))

      const tcTokenUrlSubdomains = ['test-subdom']
      const preloadedState = {
        auth: {
          cdc: {
            idToken: 'my_id_token',
            sessionToken: 'my_session_token',
            sessionSecret: 'my_session_secret',
            sessionValidity: -2,
          },
          commerce: {
            access_token: 'my_access_token',
          },
        },
        persisted: {
          cardSimulation: {
            simulateCard: false,
          },
          persistedAppCore: {
            appConfig: {
              eid: {
                tcTokenUrlSubdomains: tcTokenUrlSubdomains,
              },
            },
          },
        },
      } as RootState

      const store = configureMockStore({ middlewares: [cdcApi.middleware], preloadedState })

      const result = await store.dispatch(eidAusweisApp2Service.startAA2AuthFlow({ messages })).unwrap()

      expect(result.response).toBe(EidFlowResponse.EidMessageError)
      expect((result as any).msg).toBe(mockedBadState)

      expect(readerIsAvailableMock).toBeCalledTimes(1)
      expect(runAuthMock).toBeCalledTimes(1)
    })
  })

  describe('startScanning', () => {
    const preloadedState = {
      persisted: {
        cardSimulation: {
          simulateCard: false,
        },
      },
    } as RootState
    const store = configureMockStore({ middlewares: [], preloadedState })

    beforeAll(() => {
      Platform.OS = 'ios'
    })

    test('should handle the initial scan in the auth flow', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.AccessRights,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterPin: EnterPin = {
        msg: AA2Messages.EnterPin,
        reader: {
          attached: true,
          insertable: true,
          card: { inoperative: false, deactivated: false, retryCounter: 3 },
          keypad: false,
          name: 'NFC',
        },
      }
      const acceptMock = jest.spyOn(AA2CommandService, 'accept').mockImplementation(() => Promise.resolve(mockEnterPin))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      // The initial scan does not contain any input
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: {}, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.RetryPin)
      expect((result as any).retryCounter).toBe(mockEnterPin.reader?.card?.retryCounter)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(acceptMock).toBeCalledTimes(1)
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should handle the initial scan in the auth flow and return retry can', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.AccessRights,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterCan: EnterCan = {
        msg: AA2Messages.EnterCan,
        reader: {
          attached: true,
          insertable: true,
          card: { inoperative: false, deactivated: false, retryCounter: 1 },
          keypad: false,
          name: 'NFC',
        },
      }
      const acceptMock = jest.spyOn(AA2CommandService, 'accept').mockImplementation(() => Promise.resolve(mockEnterCan))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      // The initial scan does not contain any input
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: {}, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.RetryCan)
      expect((result as any).retry).toBe(false)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(acceptMock).toBeCalledTimes(1)
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should handle the initial scan in the auth flow and return retry puk', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.AccessRights,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterPuk: EnterPuk = {
        msg: AA2Messages.EnterPuk,
        reader: {
          attached: true,
          insertable: true,
          card: { inoperative: false, deactivated: false, retryCounter: 1 },
          keypad: false,
          name: 'NFC',
        },
      }
      const acceptMock = jest.spyOn(AA2CommandService, 'accept').mockImplementation(() => Promise.resolve(mockEnterPuk))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      // The initial scan does not contain any input
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: {}, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.RetryPuk)
      expect((result as any).retry).toBe(false)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(acceptMock).toBeCalledTimes(1)
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should return a specific timeout error for accept timeouts', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.AccessRights,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const acceptMock = jest
        .spyOn(AA2CommandService, 'accept')
        .mockImplementation(() => Promise.reject(new TimeoutError()))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      // The initial scan does not contain any input
      await expect(
        store.dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: {}, messages })).unwrap(),
      ).rejects.toBeInstanceOf(AA2AcceptTimeout)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(acceptMock).toBeCalledTimes(1)
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should handle enter pin in the auth flow', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.EnterPin,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockAuth: Auth = {
        msg: AA2Messages.Auth,
        result: { major: 'http://www.bsi.bund.de/ecard/api/1.1/resultmajor#ok' },
        url: 'https://test.governikus-eid.de/DEMO/?refID=123456',
      }
      const setPinMock = jest.spyOn(AA2CommandService, 'setPin').mockImplementation(() => Promise.resolve(mockAuth))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const mockPin = '123456'
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { pin: mockPin }, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.EidAuthSuccess)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledWith(mockPin, { msTimeout: AA2_TIMEOUTS.SET_PIN })
      // System UI should hide itself. Interrupt is not needed.
      expect(interruptMock).toBeCalledTimes(0)
    })

    test('should throw if card is deactivated', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.EnterPin,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterPin: EnterPin = {
        msg: AA2Messages.EnterPin,
        reader: {
          attached: true,
          insertable: false,
          card: { inoperative: false, deactivated: true, retryCounter: 0 },
          keypad: false,
          name: 'NFC',
        },
      }

      const setPinMock = jest.spyOn(AA2CommandService, 'setPin').mockImplementation(() => Promise.resolve(mockEnterPin))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const mockPin = '123456'
      await expect(
        store
          .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { pin: mockPin }, messages }))
          .unwrap(),
      ).rejects.toBeInstanceOf(AA2CardDeactivated)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledWith(mockPin, { msTimeout: AA2_TIMEOUTS.SET_PIN })
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('setPin Timeout should throw with a specific error', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.EnterPin,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const setPinMock = jest
        .spyOn(AA2CommandService, 'setPin')
        .mockImplementation(() => Promise.reject(new TimeoutError()))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const mockPin = '123456'
      await expect(
        store
          .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { pin: mockPin }, messages }))
          .unwrap(),
      ).rejects.toBeInstanceOf(AA2SetPinTimeout)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledWith(mockPin, { msTimeout: AA2_TIMEOUTS.SET_PIN })
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should handle unsuccessful auth flow', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.EnterPin,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockAuth: Auth = {
        msg: AA2Messages.Auth,
        result: { major: 'http://www.bsi.bund.de/ecard/api/1.1/resultmajor#error' },
      }
      const setPinMock = jest.spyOn(AA2CommandService, 'setPin').mockImplementation(() => Promise.resolve(mockAuth))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const mockPin = '123456'
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { pin: mockPin }, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.EidMessageError)
      expect((result as any).msg).toBe(mockAuth)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledWith(mockPin, { msTimeout: AA2_TIMEOUTS.SET_PIN })
      // System UI should hide itself. Interrupt is not needed.
      expect(interruptMock).toBeCalledTimes(0)
    })

    test('should handle enter pin in the auth flow and return Auth error', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.EnterPin,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      // BELOW_MIN_YEAR_OF_BIRTH is now set, so auth should fail
      const mockAuth: Auth = {
        msg: AA2Messages.Auth,
        result: { major: 'http://www.bsi.bund.de/ecard/api/1.1/resultmajor#ok' },
        url: 'https://test.governikus-eid.de/DEMO/?refID=123456&errorCode=BELOW_MIN_YEAR_OF_BIRTH',
      }
      const setPinMock = jest.spyOn(AA2CommandService, 'setPin').mockImplementationOnce(() => Promise.resolve(mockAuth))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const mockPin = '123456'
      await expect(
        store
          .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { pin: mockPin }, messages }))
          .unwrap(),
      ).rejects.toBeInstanceOf(AA2BelowMinYearOfBirth)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledWith(mockPin, { msTimeout: AA2_TIMEOUTS.SET_PIN })
      // System UI should hide itself. Interrupt is not needed.
      expect(interruptMock).toBeCalledTimes(0)

      setPinMock.mockImplementationOnce(() =>
        Promise.resolve({
          msg: AA2Messages.Auth,
          result: { major: 'http://www.bsi.bund.de/ecard/api/1.1/resultmajor#ok' },
          url: 'https://test.governikus-eid.de/DEMO/?errorCode=BELOW_MIN_AGE',
        }),
      )
      await expect(
        store
          .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { pin: mockPin }, messages }))
          .unwrap(),
      ).rejects.toBeInstanceOf(AA2BelowMinAge)

      setPinMock.mockImplementationOnce(() =>
        Promise.resolve({
          msg: AA2Messages.Auth,
          result: { major: 'http://www.bsi.bund.de/ecard/api/1.1/resultmajor#ok' },
          url: 'https://test.governikus-eid.de/DEMO?errorCode=FOREIGN_RESIDENCY',
        }),
      )
      await expect(
        store
          .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { pin: mockPin }, messages }))
          .unwrap(),
      ).rejects.toBeInstanceOf(AA2ForeignResidency)

      setPinMock.mockImplementationOnce(() =>
        Promise.resolve({
          msg: AA2Messages.Auth,
          result: { major: 'http://www.bsi.bund.de/ecard/api/1.1/resultmajor#ok' },
          url: 'https://test.governikus-eid.de/DEMO/?refID=123456&errorCode=PSEUDONYM_ALREADY_IN_USE',
        }),
      )
      await expect(
        store
          .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { pin: mockPin }, messages }))
          .unwrap(),
      ).rejects.toBeInstanceOf(AA2PseudonymAlreadyInUse)

      setPinMock.mockImplementationOnce(() =>
        Promise.resolve({
          msg: AA2Messages.Auth,
          result: { major: 'http://www.bsi.bund.de/ecard/api/1.1/resultmajor#ok' },
          url: 'https://test.governikus-eid.de/DEMO/?errorCode=UNKNOWN',
        }),
      )
      await expect(
        store
          .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { pin: mockPin }, messages }))
          .unwrap(),
      ).rejects.toBeInstanceOf(AA2AuthError)
    })

    test('should handle enter can in the auth flow', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.EnterCan,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterPin: EnterPin = {
        msg: AA2Messages.EnterPin,
        reader: {
          attached: true,
          insertable: false,
          card: { inoperative: false, deactivated: false, retryCounter: 1 },
          keypad: false,
          name: 'NFC',
        },
      }

      const setCanMock = jest.spyOn(AA2CommandService, 'setCan').mockImplementation(() => Promise.resolve(mockEnterPin))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const mockCan = '123456'
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { can: mockCan }, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.RetryPin)
      expect((result as any).retryCounter).toBe(mockEnterPin.reader?.card?.retryCounter)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(setCanMock).toBeCalledTimes(1)
      expect(setCanMock).toBeCalledWith(mockCan, { msTimeout: AA2_TIMEOUTS.SET_CAN })
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should handle enter puk in the auth flow', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.EnterPuk,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterPin: EnterPin = {
        msg: AA2Messages.EnterPin,
        reader: {
          attached: true,
          insertable: false,
          card: { inoperative: false, deactivated: false, retryCounter: 1 },
          keypad: false,
          name: 'NFC',
        },
      }

      const setPukMock = jest.spyOn(AA2CommandService, 'setPuk').mockImplementation(() => Promise.resolve(mockEnterPin))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const mockPuk = '1234567890'
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { puk: mockPuk }, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.RetryPin)
      expect((result as any).retryCounter).toBe(mockEnterPin.reader?.card?.retryCounter)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(setPukMock).toBeCalledTimes(1)
      expect(setPukMock).toBeCalledWith(mockPuk, { msTimeout: AA2_TIMEOUTS.SET_PUK })
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should handle a enter pin retry in the auth flow', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.EnterPin,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterPin: EnterPin = {
        msg: AA2Messages.EnterPin,
        reader: {
          attached: true,
          insertable: false,
          card: { inoperative: false, deactivated: false, retryCounter: 1 },
          keypad: false,
          name: 'NFC',
        },
      }
      const setPinMock = jest.spyOn(AA2CommandService, 'setPin').mockImplementation(() => Promise.resolve(mockEnterPin))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const mockPin = '123456'
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { pin: mockPin }, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.RetryPin)
      expect((result as any).retryCounter).toBe(mockEnterPin.reader?.card?.retryCounter)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledWith(mockPin, { msTimeout: AA2_TIMEOUTS.SET_PIN })
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should handle a enter can retry in the auth flow', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.EnterCan,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterCan: EnterCan = {
        msg: AA2Messages.EnterCan,
        reader: {
          attached: true,
          insertable: false,
          card: { inoperative: false, deactivated: false, retryCounter: 1 },
          keypad: false,
          name: 'NFC',
        },
      }
      const setCanMock = jest.spyOn(AA2CommandService, 'setCan').mockImplementation(() => Promise.resolve(mockEnterCan))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const mockCan = '123456'
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { can: mockCan }, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.RetryCan)
      expect((result as any).retry).toBe(true)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(setCanMock).toBeCalledTimes(1)
      expect(setCanMock).toBeCalledWith(mockCan, { msTimeout: AA2_TIMEOUTS.SET_CAN })
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should handle a enter puk retry in the auth flow', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.EnterPuk,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterPuk: EnterPuk = {
        msg: AA2Messages.EnterPuk,
        reader: {
          attached: true,
          insertable: false,
          card: { inoperative: false, deactivated: false, retryCounter: 1 },
          keypad: false,
          name: 'NFC',
        },
      }
      const setPukMock = jest.spyOn(AA2CommandService, 'setPuk').mockImplementation(() => Promise.resolve(mockEnterPuk))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const mockPuk = '1234567890'
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { puk: mockPuk }, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.RetryPuk)
      expect((result as any).retry).toBe(true)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(setPukMock).toBeCalledTimes(1)
      expect(setPukMock).toBeCalledWith(mockPuk, { msTimeout: AA2_TIMEOUTS.SET_PUK })
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should handle the initial scan in the change pin flow', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: null,
        progress: null,
        state: null,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterPin: EnterPin = {
        msg: AA2Messages.EnterPin,
        reader: {
          attached: true,
          insertable: true,
          card: { inoperative: false, deactivated: false, retryCounter: 3 },
          keypad: false,
          name: 'NFC',
        },
      }
      const changePinMock = jest
        .spyOn(AA2CommandService, 'changePin')
        .mockImplementation(() => Promise.resolve(mockEnterPin))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      // The initial scan does not contain any input
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'ChangePin', userInput: {}, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.RetryPin)
      expect((result as any).retryCounter).toBe(mockEnterPin.reader?.card?.retryCounter)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(changePinMock).toBeCalledTimes(1)
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should handle the initial scan with enter can in the change pin flow', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: null,
        progress: null,
        state: null,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterCan: EnterCan = {
        msg: AA2Messages.EnterCan,
        reader: {
          attached: true,
          insertable: true,
          card: { inoperative: false, deactivated: false, retryCounter: 1 },
          keypad: false,
          name: 'NFC',
        },
      }
      const changePinMock = jest
        .spyOn(AA2CommandService, 'changePin')
        .mockImplementation(() => Promise.resolve(mockEnterCan))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      // The initial scan does not contain any input
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'ChangePin', userInput: {}, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.RetryCan)
      expect((result as any).retry).toBe(false)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(changePinMock).toBeCalledTimes(1)
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should handle the initial scan with enter puk in the change pin flow', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: null,
        progress: null,
        state: null,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterPuk: EnterPuk = {
        msg: AA2Messages.EnterPuk,
        reader: {
          attached: true,
          insertable: true,
          card: { inoperative: false, deactivated: false, retryCounter: 1 },
          keypad: false,
          name: 'NFC',
        },
      }
      const changePinMock = jest
        .spyOn(AA2CommandService, 'changePin')
        .mockImplementation(() => Promise.resolve(mockEnterPuk))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      // The initial scan does not contain any input
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'ChangePin', userInput: {}, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.RetryPuk)
      expect((result as any).retry).toBe(false)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(changePinMock).toBeCalledTimes(1)
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should handle the new pin scan in the change pin flow', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'CHANGE_PIN',
        progress: null,
        state: AA2Messages.EnterPin,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterNewPin: EnterNewPin = {
        msg: AA2Messages.EnterNewPin,
        reader: {
          attached: true,
          insertable: true,
          card: { inoperative: false, deactivated: false, retryCounter: 3 },
          keypad: false,
          name: 'NFC',
        },
      }
      const setPinMock = jest
        .spyOn(AA2CommandService, 'setPin')
        .mockImplementation(() => Promise.resolve(mockEnterNewPin))
      const mockChangePin: ChangePin = {
        msg: AA2Messages.ChangePin,
        success: true,
      }
      const setNewPinMock = jest
        .spyOn(AA2CommandService, 'setNewPin')
        .mockImplementation(() => Promise.resolve(mockChangePin))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const mockedPin = '12345'
      const mockedNewPin = '123456'
      const result = await store
        .dispatch(
          eidAusweisApp2Service.startScanning({
            flow: 'ChangePin',
            userInput: { pin: mockedPin, newPin: mockedNewPin },
            messages,
          }),
        )
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.EidChangePinSuccess)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledWith(mockedPin, { msTimeout: AA2_TIMEOUTS.SET_PIN })
      expect(setNewPinMock).toBeCalledTimes(1)
      expect(setNewPinMock).toBeCalledWith(mockedNewPin, { msTimeout: AA2_TIMEOUTS.SET_NEW_PIN })
      // System dialog will be close automatically, so interrupt must not be called
      expect(interruptMock).toBeCalledTimes(0)
    })

    test('should handle a unsuccessful change pin flow', async () => {
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'CHANGE_PIN',
        progress: null,
        state: AA2Messages.EnterPin,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockEnterNewPin: EnterNewPin = {
        msg: AA2Messages.EnterNewPin,
        reader: {
          attached: true,
          insertable: true,
          card: { inoperative: false, deactivated: false, retryCounter: 3 },
          keypad: false,
          name: 'NFC',
        },
      }
      const setPinMock = jest
        .spyOn(AA2CommandService, 'setPin')
        .mockImplementation(() => Promise.resolve(mockEnterNewPin))
      const mockChangePin: ChangePin = {
        msg: AA2Messages.ChangePin,
        success: false,
      }
      const setNewPinMock = jest
        .spyOn(AA2CommandService, 'setNewPin')
        .mockImplementation(() => Promise.resolve(mockChangePin))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const mockedPin = '12345'
      const mockedNewPin = '123456'
      const result = await store
        .dispatch(
          eidAusweisApp2Service.startScanning({
            flow: 'ChangePin',
            userInput: { pin: mockedPin, newPin: mockedNewPin },
            messages,
          }),
        )
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.EidMessageError)
      expect((result as any).msg).toBe(mockChangePin)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledWith(mockedPin, { msTimeout: AA2_TIMEOUTS.SET_PIN })
      expect(setNewPinMock).toBeCalledTimes(1)
      expect(setNewPinMock).toBeCalledWith(mockedNewPin, { msTimeout: AA2_TIMEOUTS.SET_NEW_PIN })
      // System dialog will be close automatically, so interrupt must not be called
      expect(interruptMock).toBeCalledTimes(0)
    })

    test('should not throw and return error message on message error', async () => {
      const mockInvalid: Invalid = {
        msg: AA2Messages.Invalid,
        error: 'TEST',
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.reject(mockInvalid))

      const result = await store
        .dispatch(
          eidAusweisApp2Service.startScanning({
            flow: 'ChangePin',
            userInput: {},
            messages,
          }),
        )
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.EidMessageError)
      expect((result as any).msg).toBe(mockInvalid)

      expect(getStatusMock).toBeCalledTimes(1)
    })

    test('should throw on timeout', async () => {
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.reject(new TimeoutError()))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      await expect(
        store
          .dispatch(
            eidAusweisApp2Service.startScanning({
              flow: 'ChangePin',
              userInput: {},
              messages,
            }),
          )
          .unwrap(),
      ).rejects.toBeInstanceOf(AA2Timeout)

      expect(getStatusMock).toBeCalledTimes(1)
      // Interrupt needs to be called, as the Timeout is not thrown by the SDK
      // and otherwise the System dialog will still be shown.
      expect(interruptMock).toBeCalledTimes(1)
    })

    test('should not interrupt on Android', async () => {
      Platform.OS = 'android'
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.reject(new TimeoutError()))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      await expect(
        store
          .dispatch(
            eidAusweisApp2Service.startScanning({
              flow: 'ChangePin',
              userInput: {},
              messages,
            }),
          )
          .unwrap(),
      ).rejects.toBeInstanceOf(AA2Timeout)

      expect(getStatusMock).toBeCalledTimes(1)
      // Interrupt is not called on Android
      expect(interruptMock).toBeCalledTimes(0)
    })
  })

  describe('startScanning with simulated Card', () => {
    const preloadedState = {
      persisted: {
        cardSimulation: {
          simulateCard: true,
          simulatedCardName: 'Berta2006',
        },
      },
    } as RootState
    const store = configureMockStore({ middlewares: [], preloadedState })

    beforeAll(() => {
      Platform.OS = 'ios'
    })

    test('should set pin to undefined when simulating card', async () => {
      const unsubscribeMock = jest.fn()
      const handleInsertCardMock = jest.spyOn(AA2WorkflowHelper, 'handleInsertCard').mockImplementation(
        _inputFn =>
          ({
            unsubscribe: unsubscribeMock,
          }) as any,
      )
      const mockStatus: Status = {
        msg: AA2Messages.Status,
        workflow: 'AUTH',
        progress: null,
        state: AA2Messages.EnterPin,
      }
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.resolve(mockStatus))

      const mockAuth: Auth = {
        msg: AA2Messages.Auth,
        result: { major: 'http://www.bsi.bund.de/ecard/api/1.1/resultmajor#ok' },
        url: 'https://test.governikus-eid.de/DEMO/?refID=123456',
      }
      const setPinMock = jest.spyOn(AA2CommandService, 'setPin').mockImplementation(() => Promise.resolve(mockAuth))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const mockPin = '123456'
      const result = await store
        .dispatch(eidAusweisApp2Service.startScanning({ flow: 'Auth', userInput: { pin: mockPin }, messages }))
        .unwrap()

      expect(result.response).toBe(EidFlowResponse.EidAuthSuccess)

      expect(getStatusMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledTimes(1)
      expect(setPinMock).toBeCalledWith(undefined, { msTimeout: AA2_TIMEOUTS.SET_PIN })
      // System UI should hide itself. Interrupt is not needed.
      expect(interruptMock).toBeCalledTimes(0)

      expect(handleInsertCardMock).toBeCalledTimes(1)
      expect(unsubscribeMock).toBeCalledTimes(1)
    })

    test('should not interrupt when simulating the card', async () => {
      const unsubscribeMock = jest.fn()
      const handleInsertCardMock = jest.spyOn(AA2WorkflowHelper, 'handleInsertCard').mockImplementation(
        _inputFn =>
          ({
            unsubscribe: unsubscribeMock,
          }) as any,
      )
      const getStatusMock = jest
        .spyOn(AA2CommandService, 'getStatus')
        .mockImplementation(() => Promise.reject(new TimeoutError()))
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      await expect(
        store
          .dispatch(
            eidAusweisApp2Service.startScanning({
              flow: 'ChangePin',
              userInput: {},
              messages,
            }),
          )
          .unwrap(),
      ).rejects.toBeInstanceOf(AA2Timeout)

      expect(getStatusMock).toBeCalledTimes(1)
      // Interrupt is not called when Simulating Cards
      expect(interruptMock).toBeCalledTimes(0)

      expect(handleInsertCardMock).toBeCalledTimes(1)
      expect(unsubscribeMock).toBeCalledTimes(1)
    })

    test('should set simulated card if handleInsertCard callback is called', async () => {
      const unsubscribeMock = jest.fn()
      let callbackFn: (message: InsertCard) => void = () => {}
      const handleInsertCardMock = jest.spyOn(AA2WorkflowHelper, 'handleInsertCard').mockImplementation(inputFn => {
        callbackFn = inputFn
        return {
          unsubscribe: unsubscribeMock,
        } as any
      })

      const setCardMock = jest.spyOn(AA2CommandService, 'setCard').mockImplementation(() => {})

      const mockInvalid: Invalid = {
        msg: AA2Messages.Invalid,
        error: 'TEST',
      }
      let continueCallback: () => void = () => {}
      const getStatusMock = jest.spyOn(AA2CommandService, 'getStatus').mockImplementation(() => {
        return new Promise((_res, rej) => {
          continueCallback = () => rej(mockInvalid)
        })
      })
      const interruptMock = jest.spyOn(AA2CommandService, 'interrupt').mockImplementation(() => {})

      const resultPromise = store
        .dispatch(
          eidAusweisApp2Service.startScanning({
            flow: 'ChangePin',
            userInput: {},
            messages,
          }),
        )
        .unwrap()

      await waitFor(() => expect(handleInsertCardMock).toBeCalledTimes(1))
      callbackFn({ msg: AA2Messages.InsertCard })
      expect(setCardMock).toBeCalledTimes(1)
      const lastCall = setCardMock.mock.lastCall
      expect(lastCall?.[0]).toBe('Simulator')
      expect(lastCall?.[1]).toBeDefined()

      await waitFor(() => expect(getStatusMock).toBeCalledTimes(1))
      continueCallback()

      const result = await resultPromise
      expect(result.response).toBe(EidFlowResponse.EidMessageError)
      expect((result as any).msg).toBe(mockInvalid)

      // Interrupt is not called when simulating Card
      expect(interruptMock).toBeCalledTimes(0)

      expect(handleInsertCardMock).toBeCalledTimes(1)
      expect(unsubscribeMock).toBeCalledTimes(1)
    })
  })

  describe('cancelFlow', () => {
    test('should cancel the active Flow', async () => {
      const cancelMock = jest
        .spyOn(AA2CommandService, 'cancel')
        .mockImplementation(() => Promise.resolve({ msg: AA2Messages.Auth, error: 'TEST' }))

      await eidAusweisApp2Service.cancelFlow()

      expect(cancelMock).toBeCalledTimes(1)
    })
  })

  describe('stopSDK', () => {
    test('should stop the AA2 SDK', async () => {
      const stopMock = jest.spyOn(AA2CommandService, 'stop').mockImplementation(() => Promise.resolve())

      await eidAusweisApp2Service.stopSDK()

      expect(stopMock).toBeCalledTimes(1)
    })
  })
})
