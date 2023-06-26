import { BaseQueryApi } from '@reduxjs/toolkit/dist/query'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { HttpStatusUnauthorizedError } from '../../errors/errors'
import { RootState } from '../../redux/configure-store'
import { configureMockStore } from '../../testing/configure-mock-store'
import { axiosBaseQuery } from '../common/base-query'
import { repeatRequestIfInvalidToken } from './repeat-request-if-invalid-token'
import * as sessionService from '../../session/session-service'

const server = setupServer()

describe('repeatRequestIfInvalidToken', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  const authCdcState = {
    sessionToken: 'fakeit',
    sessionSecret: 'untilyoumakeit',
    sessionValidity: Date.now() + 10000,
  }

  const store = configureMockStore({
    preloadedState: {
      auth: {
        cdc: authCdcState,
      },
    } as RootState,
  })

  it('Should successfully obtain a new OAuth Token and repeat the request successfully', async () => {
    let obtainedNewToken = false
    let success = false
    let gotNewProfile = false

    server.use(
      rest.get('*/current/profile', (_req, res, ctx) => {
        if (success) {
          gotNewProfile = true
          return res(ctx.status(200), ctx.json({ ok: true }))
        }

        success = true
        return res(
          ctx.status(401),
          ctx.json({ errors: [{ type: 'InvalidTokenError', message: 'Invalid access token' }] }),
        )
      }),
      rest.post('*/accounts.getAccountInfo', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ id_token: 'new_id_token' }))
      }),
      rest.post('*/authorizationserver/oauth/token', (_req, res, ctx) => {
        obtainedNewToken = true
        return res(
          ctx.status(200),
          ctx.json({ access_token: 'forreal', token_type: 'bearer', expires_in: 43189, scope: 'basic openid' }),
        )
      }),
    )

    const queryWithHandlingInvalidToken = repeatRequestIfInvalidToken(axiosBaseQuery)
    const response = await queryWithHandlingInvalidToken(
      { url: 'http://localhost/current/profile' },
      {
        getState: store.getState,
        dispatch: store.dispatch,
      } as BaseQueryApi,
      {},
    )

    expect(response.data).toEqual({ ok: true })
    expect(success).toBeTruthy()
    expect(gotNewProfile).toBeTruthy()
    expect(obtainedNewToken).toBeTruthy()
  })

  it('Should logout if obtaining a new token fails', async () => {
    let requestProfileCounter = 0
    let requestLogout = false

    server.use(
      rest.get('*/current/profile', (_req, res, ctx) => {
        requestProfileCounter++
        return res(
          ctx.status(401),
          ctx.json({ errors: [{ type: 'InvalidTokenError', message: 'Invalid access token' }] }),
        )
      }),
      rest.post('*/accounts.getAccountInfo', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ id_token: 'new_id_token' }))
      }),
      rest.post('*/authorizationserver/oauth/token', (_req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ ok: false }))
      }),
      rest.post('*/accounts.logout', (_req, res, ctx) => {
        requestLogout = true
        return res(ctx.status(200), ctx.json({ ok: true }))
      }),
      rest.post('*/oauth/revoke', (_req, res, ctx) => res(ctx.status(200))),
    )

    jest.spyOn(sessionService, 'clearCdcSession').mockImplementation(() => Promise.resolve())
    jest.spyOn(sessionService, 'clearCommerceSession').mockImplementation(() => Promise.resolve())

    const queryWithHandlingInvalidToken = repeatRequestIfInvalidToken(axiosBaseQuery)
    const response = await queryWithHandlingInvalidToken(
      { url: 'http://localhost/current/profile' },
      {
        getState: store.getState,
        dispatch: store.dispatch,
      } as BaseQueryApi,
      {},
    )

    expect(response.error).toBeInstanceOf(HttpStatusUnauthorizedError)
    // should calling the api only once because obtaining token fails
    expect(requestProfileCounter).toBe(1)
    expect(requestLogout).toBe(true)
  })
})
