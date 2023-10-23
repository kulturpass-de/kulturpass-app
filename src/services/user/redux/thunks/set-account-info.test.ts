import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { cdcApi } from '../../../api/cdc-api'
import { AccountsSetAccountInfoSignedRequestParams } from '../../../api/types'
import { getRegistrationToken } from '../../../auth/store/auth-selectors'
import { authSlice } from '../../../auth/store/auth-slice'
import { CdcSessionData } from '../../../session/types'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { userSlice } from '../user-slice'
import { setAccountInfo } from './set-account-info'

const server = setupServer()

describe('setAccountInfo', () => {
  const store = configureMockStore({ middlewares: [cdcApi.middleware] })
  const mockedParams = { profile: { firstName: 'TEST', email: 'test@test.com' } }

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
    store.clearActions()
  })
  afterAll(() => server.close())

  it('should call setAccountInfo signed without regToken', async () => {
    server.use(rest.post('*/accounts.setAccountInfo', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))))
    expect(getRegistrationToken(store.getState())).toBeUndefined()
    await store.dispatch(setAccountInfo({ params: mockedParams }))

    // find setAccountInfo pending, and check that it was called with correct args
    const setAccountInfoPending = store.findAction(cdcApi.endpoints.accountsSetAccountInfoSigned.matchPending)
    expect(setAccountInfoPending?.meta.arg.originalArgs).toEqual(mockedParams)
  })

  it('should call setAccountInfo unsigned with regToken', async () => {
    server.use(rest.post('*/accounts.setAccountInfo', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))))
    expect(getRegistrationToken(store.getState())).toBeUndefined()
    const regToken = 'TESTREGTOKEN'
    await store.dispatch(setAccountInfo({ params: mockedParams, regToken }))

    // find setAccountInfo pending, and check that it was called with correct args
    const setAccountInfoPending = store.findAction(
      cdcApi.endpoints.accountsSetAccountInfoWithRegTokenUnsigned.matchPending,
    )
    expect(setAccountInfoPending?.meta.arg.originalArgs).toEqual({ ...mockedParams, regToken })
  })

  it('should call setAccountInfo unsigned with regToken of store', async () => {
    server.use(rest.post('*/accounts.setAccountInfo', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))))
    const regToken = 'TESTREGTOKEN'

    store.dispatch(authSlice.actions.setCdcSession({ regToken } as CdcSessionData))
    await store.dispatch(setAccountInfo({ params: mockedParams }))

    // find setAccountInfo pending, and check that it was called with correct args
    const setAccountInfoPending = store.findAction(
      cdcApi.endpoints.accountsSetAccountInfoWithRegTokenUnsigned.matchPending,
    )
    expect(setAccountInfoPending?.meta.arg.originalArgs).toEqual({ ...mockedParams, regToken })
  })

  it('should set profile firstName if setAccountInfo was successful', async () => {
    server.use(rest.post('*/accounts.setAccountInfo', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))))
    await store.dispatch(setAccountInfo({ params: mockedParams }))

    expect(store.findAction(cdcApi.endpoints.accountsSetAccountInfoWithRegTokenUnsigned.matchPending)).toBeDefined()
    store.expectActions([
      { type: userSlice.actions.setUserProfile.type, payload: { firstName: mockedParams.profile.firstName } },
    ])
  })

  it('should not set profile firstName if setAccountInfo was unsuccessful', async () => {
    server.use(rest.post('*/accounts.setAccountInfo', (_req, res, ctx) => res(ctx.status(400), ctx.json({}))))
    await store.dispatch(setAccountInfo({ params: mockedParams }))

    expect(store.findAction(cdcApi.endpoints.accountsSetAccountInfoWithRegTokenUnsigned.matchRejected)).toBeDefined()
    store.expectActionNotDispatched(userSlice.actions.setUserProfile.match)
  })

  it('should not set profile firstName if firstName was not part of params', async () => {
    server.use(rest.post('*/accounts.setAccountInfo', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))))
    const params: AccountsSetAccountInfoSignedRequestParams = {
      data: {
        deletionRequested: true,
      },
    }
    await store.dispatch(setAccountInfo({ params }))

    expect(store.findAction(cdcApi.endpoints.accountsSetAccountInfoWithRegTokenUnsigned.matchFulfilled)).toBeDefined()
    store.expectActionNotDispatched(userSlice.actions.setUserProfile.match)
  })
})
