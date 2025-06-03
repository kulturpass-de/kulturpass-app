import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import { getIsUserLoggedIn } from '../../../auth/store/auth-selectors'
import { CdcInvalidLoginIdDeleteError } from '../../../errors/cdc-errors'
import { UnknownError } from '../../../errors/errors'
import { logger } from '../../../logger'
import { RootState } from '../../../redux/configure-store'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { deleteAccount } from './delete-account'

jest.useFakeTimers()

describe('deleteAccount', () => {
  const server = setupServer()

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
  })
  afterAll(() => server.close())

  it("should delete the user's account and logout after if loggedin", async () => {
    const preloadedState = {
      auth: {
        cdc: {
          idToken: 'my_id_token',
          sessionToken: 'my_session_token',
          sessionSecret: 'my_session_secret',
          sessionValidity: -2,
          isVerified: true,
          user: {
            email: 'test@test.de',
          },
        },
        commerce: {
          access_token: 'my_access_token',
          expires_in: 1000,
          token_valid_until: Date.now() + 1000,
        },
      },
    } as RootState

    const store = configureMockStore({ middlewares: [cdcApi.middleware, commerceApi.middleware], preloadedState })

    let setAccountInfoParams: any
    server.use(
      http.post('http://localhost/cdc/accounts.login', () =>
        HttpResponse.json(
          {
            sessionInfo: {
              sessionToken: 'newDummyToken',
              sessionSecret: 'newDummySecret',
            },
          },
          { status: 200 },
        ),
      ),
      http.post('http://localhost/cdc/accounts.setAccountInfo', async ({ request: req }) => {
        const params = await req.text()
        // Converting search params without some library...
        const tempUrl = new URL('localhost:1000?' + params)
        setAccountInfoParams = tempUrl.searchParams
        return HttpResponse.json({}, { status: 200 })
      }),
      http.post('*/accounts.logout', () => HttpResponse.json({}, { status: 200 })),
      http.post('http://localhost/authorizationserver/oauth/revoke', () => HttpResponse.json({}, { status: 200 })),
    )

    expect(getIsUserLoggedIn(store.getState())).toBe(true)
    expect(setAccountInfoParams).toBeUndefined()

    await store.dispatch(deleteAccount({ password: 'dummy' })).unwrap()

    expect(getIsUserLoggedIn(store.getState())).toBe(false)
    expect(setAccountInfoParams.get('oauth_token')).toBe('newDummyToken')
    expect(setAccountInfoParams.get('sig')).toBeTruthy()
    expect(JSON.parse(setAccountInfoParams.get('data')).deletionRequested).toBe(true)
    expect(
      store.findAction(cdcApi.endpoints.accountsSetAccountInfoWithCustomSessionSigned.matchFulfilled),
    ).toBeDefined()
  })

  it("should delete the user's account and logout after if registered", async () => {
    const preloadedState = {
      auth: {
        cdc: {
          idToken: 'my_id_token',
          regToken: 'my_reg_token',
          sessionValidity: -2,
          isVerified: false,
          user: {
            email: 'test@test.de',
          },
        },
        commerce: {
          access_token: 'my_access_token',
          expires_in: 1000,
          token_valid_until: Date.now() + 1000,
        },
      },
    } as RootState

    const store = configureMockStore({ middlewares: [cdcApi.middleware, commerceApi.middleware], preloadedState })

    let setAccountInfoParams: any
    server.use(
      http.post('http://localhost/cdc/accounts.login', () =>
        HttpResponse.json(
          {
            regToken: 'newDummyRegToken',
          },
          { status: 200 },
        ),
      ),
      http.post('http://localhost/cdc/accounts.setAccountInfo', async ({ request: req }) => {
        const params = await req.text()
        // Converting search params without some library...
        const tempUrl = new URL('localhost:1000?' + params)
        setAccountInfoParams = tempUrl.searchParams
        return HttpResponse.json({}, { status: 200 })
      }),
      http.post('*/accounts.logout', () => HttpResponse.json({}, { status: 200 })),
      http.post('http://localhost/authorizationserver/oauth/revoke', () => HttpResponse.json({}, { status: 200 })),
    )

    expect(getIsUserLoggedIn(store.getState())).toBe(true)
    expect(setAccountInfoParams).toBeUndefined()

    await store.dispatch(deleteAccount({ password: 'dummy' })).unwrap()

    expect(getIsUserLoggedIn(store.getState())).toBe(false)
    expect(setAccountInfoParams.get('regToken')).toBe('newDummyRegToken')
    expect(setAccountInfoParams.get('apiKey')).toBeTruthy()
    expect(JSON.parse(setAccountInfoParams.get('data')).deletionRequested).toBe(true)
    expect(store.findAction(cdcApi.endpoints.accountsSetAccountInfoWithRegTokenUnsigned.matchFulfilled)).toBeDefined()
  })

  it('should throw an error if email is not set', async () => {
    const warnSpy = jest.spyOn(logger, 'warn').mockImplementationOnce(() => {})
    const preloadedState = {
      auth: {
        cdc: {
          idToken: 'my_id_token',
          sessionToken: 'my_session_token',
          sessionSecret: 'my_session_secret',
          sessionValidity: -2,
          isVerified: true,
          user: {
            email: '',
          },
        },
        commerce: {
          access_token: 'my_access_token',
          expires_in: 1000,
          token_valid_until: Date.now() + 1000,
        },
      },
    } as RootState

    const store = configureMockStore({ middlewares: [cdcApi.middleware], preloadedState })

    await expect(store.dispatch(deleteAccount({ password: 'dummy' })).unwrap()).rejects.toThrow(UnknownError)
    expect(warnSpy).toHaveBeenCalledWith('deleteAccount email not set. Is the user logged in?')
  })

  it('should throw an error if session info is missing after login', async () => {
    const warnSpy = jest.spyOn(logger, 'warn').mockImplementationOnce(() => {})
    const preloadedState = {
      auth: {
        cdc: {
          idToken: 'my_id_token',
          sessionToken: 'my_session_token',
          sessionSecret: 'my_session_secret',
          sessionValidity: -2,
          isVerified: true,
          user: {
            email: 'test@test.de',
          },
        },
        commerce: {
          access_token: 'my_access_token',
          expires_in: 1000,
          token_valid_until: Date.now() + 1000,
        },
      },
    } as RootState

    const store = configureMockStore({ middlewares: [cdcApi.middleware], preloadedState })
    server.use(http.post('http://localhost/cdc/accounts.login', () => HttpResponse.json({}, { status: 200 })))

    await expect(store.dispatch(deleteAccount({ password: 'dummy' })).unwrap()).rejects.toThrow(UnknownError)
    expect(warnSpy).toHaveBeenCalledWith('deleteAccount session info missing after login')
  })

  it('should throw a specific error if login credentials are invalid', async () => {
    const preloadedState = {
      auth: {
        cdc: {
          idToken: 'my_id_token',
          sessionToken: 'my_session_token',
          sessionSecret: 'my_session_secret',
          sessionValidity: -2,
          isVerified: true,
          user: {
            email: 'test@test.de',
          },
        },
        commerce: {
          access_token: 'my_access_token',
          expires_in: 1000,
          token_valid_until: Date.now() + 1000,
        },
      },
    } as RootState

    const store = configureMockStore({ middlewares: [cdcApi.middleware], preloadedState })
    server.use(
      http.post('http://localhost/cdc/accounts.login', () =>
        HttpResponse.json(
          {
            errorCode: 403042,
            errorDetails: 'invalid loginID or password',
            errorMessage: 'Invalid LoginID',
            apiVersion: 2,
            statusCode: 403,
            statusReason: 'Forbidden',
          },
          { status: 200 },
        ),
      ),
    )

    await expect(store.dispatch(deleteAccount({ password: 'dummy' })).unwrap()).rejects.toThrow(
      CdcInvalidLoginIdDeleteError,
    )
  })
})
