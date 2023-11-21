import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { cdcApi } from '../../../api/cdc-api'
import { getRegistrationToken } from '../../../auth/store/auth-selectors'
import { authSlice } from '../../../auth/store/auth-slice'
import { CdcSessionData } from '../../../session/types'
import { configureMockStore, mockedLoggedInAuthState } from '../../../testing/configure-mock-store'
import { getAccountInfo } from './get-account-info'

describe('getAccountInfo', () => {
  const server = setupServer()

  const mockServer = () => {
    server.use(http.post('*/accounts.getAccountInfo', () => HttpResponse.json(mockedResponse, { status: 200 })))
  }

  const store = configureMockStore({ middlewares: [cdcApi.middleware], preloadedState: mockedLoggedInAuthState })
  const mockedResponse = { id_token: 'testToken', profile: { firstName: 'TEST', email: 'test@test.com' } }

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
    store.clearActions()
  })
  afterAll(() => server.close())

  it('should call getAccountInfo signed without regToken', async () => {
    mockServer()
    expect(getRegistrationToken(store.getState())).toBeUndefined()

    const response = await store.dispatch(getAccountInfo()).unwrap()

    expect(store.findAction(cdcApi.endpoints.accountsGetAccountInfoSigned.matchPending)).toBeDefined()
    expect(response).toEqual(mockedResponse)
  })

  it('should call setAccountInfo unsigned with regToken', async () => {
    mockServer()

    expect(getRegistrationToken(store.getState())).toBeUndefined()

    const regToken = 'TESTREGTOKEN'
    const response = await store.dispatch(getAccountInfo({ regToken })).unwrap()

    // find getAccountInfo pending, and check that it was called with correct args
    const getAccountInfoPending = store.findAction(
      cdcApi.endpoints.accountsGetAccountInfoWithRegTokenUnsigned.matchPending,
    )
    expect(getAccountInfoPending?.meta.arg.originalArgs).toEqual({ regToken })
    expect(response).toEqual(mockedResponse)
  })

  it('should call setAccountInfo unsigned with regToken of store', async () => {
    mockServer()
    const regToken = 'TESTREGTOKEN'

    store.dispatch(authSlice.actions.setCdcSession({ regToken } as CdcSessionData))

    const response = await store.dispatch(getAccountInfo({ regToken })).unwrap()

    // find getAccountInfo pending, and check that it was called with correct args
    const getAccountInfoPending = store.findAction(
      cdcApi.endpoints.accountsGetAccountInfoWithRegTokenUnsigned.matchPending,
    )
    expect(getAccountInfoPending?.meta.arg.originalArgs).toEqual({ regToken })
    expect(response).toEqual(mockedResponse)
  })
})
