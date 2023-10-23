import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { cdcApi } from '../../../../services/api/cdc-api'
import { RootState } from '../../../../services/redux/configure-store'
import { persistedAppCoreSlice } from '../../../../services/redux/slices/persisted-app-core'
import { AppConfig } from '../../../../services/redux/versions/current'
import { configureMockStore } from '../../../../services/testing/configure-mock-store'
import { createTcTokenUrl } from './create-tc-token-url'

const server = setupServer()

describe('createTcTokenUrl', () => {
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
  } as RootState

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
  })
  afterAll(() => server.close())

  test('should create a valid tcTokenUrl', async () => {
    const tcTokenUrlSubdomains = ['test-subdom']
    const id_token = 'test-id-token'

    const mockedAppConfig = {
      eid: {
        tcTokenUrlSubdomains: tcTokenUrlSubdomains,
      },
    } as AppConfig

    server.use(rest.post('*/accounts.getAccountInfo', (_req, res, ctx) => res(ctx.status(200), ctx.json({ id_token }))))

    const store = configureMockStore({
      middlewares: [cdcApi.middleware],
      preloadedState,
    })

    store.dispatch(persistedAppCoreSlice.actions.setAppConfig(mockedAppConfig))

    const generatedTcTokenUrl = await store.dispatch(createTcTokenUrl()).unwrap()

    expect(generatedTcTokenUrl).toBe(`http://${tcTokenUrlSubdomains[0]}.localhost/eid?idToken=${id_token}`)
  })

  test('should pick a random subdomain and create a valid tcTokenUrl', async () => {
    const tcTokenUrlSubdomains = ['test-subdom1', 'test-subdom2', 'test-subdom3']
    const id_token = 'test-id-token'

    const mockedAppConfig = {
      eid: {
        tcTokenUrlSubdomains: tcTokenUrlSubdomains,
      },
    } as AppConfig

    server.use(rest.post('*/accounts.getAccountInfo', (_req, res, ctx) => res(ctx.status(200), ctx.json({ id_token }))))

    const store = configureMockStore({
      middlewares: [cdcApi.middleware],
      preloadedState,
    })

    store.dispatch(persistedAppCoreSlice.actions.setAppConfig(mockedAppConfig))

    const generatedTcTokenUrl = await store.dispatch(createTcTokenUrl()).unwrap()

    expect(tcTokenUrlSubdomains.some(subdomain => generatedTcTokenUrl.includes(subdomain))).toBe(true)
  })

  test('should use tcTokenUrlDefaultSubdomain if no valid subdomain in appconfig', async () => {
    const tcTokenUrlSubdomains = ['$§39', '§"$%§%', '()']
    const id_token = 'test-id-token'

    const mockedAppConfig = {
      eid: {
        tcTokenUrlSubdomains: tcTokenUrlSubdomains,
      },
    } as AppConfig

    server.use(rest.post('*/accounts.getAccountInfo', (_req, res, ctx) => res(ctx.status(200), ctx.json({ id_token }))))

    const store = configureMockStore({
      middlewares: [cdcApi.middleware],
      preloadedState,
    })

    store.dispatch(persistedAppCoreSlice.actions.setAppConfig(mockedAppConfig))

    const generatedTcTokenUrl = await store.dispatch(createTcTokenUrl()).unwrap()

    expect(generatedTcTokenUrl).toBe(`http://testsubdomain.localhost/eid?idToken=${id_token}`)
  })
})
