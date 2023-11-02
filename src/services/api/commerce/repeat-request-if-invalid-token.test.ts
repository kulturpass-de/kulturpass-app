import { BaseQueryApi } from '@reduxjs/toolkit/dist/query'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { HttpStatusUnauthorizedError } from '../../errors/errors'
import { RootState } from '../../redux/configure-store'
import * as sessionService from '../../session/session-service'
import { configureMockStore } from '../../testing/configure-mock-store'
import { axiosBaseQuery } from '../common/base-query'
import { repeatRequestIfInvalidToken } from './repeat-request-if-invalid-token'

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

  it('Should successfully obtain a new OAuth Token and repeat the request successfully', async () => {
    let obtainedNewToken = false
    let success = false
    let gotNewProfile = false

    const store = configureMockStore({
      preloadedState: {
        auth: {
          cdc: authCdcState,
        },
      } as RootState,
    })

    server.use(
      http.get('*/current/profile', () => {
        if (success) {
          gotNewProfile = true
          return HttpResponse.json({ ok: true }, { status: 200 })
        }

        success = true
        return HttpResponse.json(
          { ok: false, errors: [{ type: 'InvalidTokenError', message: 'Invalid access token' }] },
          { status: 401 },
        )
      }),
      http.post('*/accounts.getAccountInfo', () => {
        return HttpResponse.json({ id_token: 'new_id_token' }, { status: 200 })
      }),
      http.post('*/authorizationserver/oauth/token', () => {
        obtainedNewToken = true
        return HttpResponse.json(
          { access_token: 'forreal', token_type: 'bearer', expires_in: 43189, scope: 'basic openid' },
          { status: 200 },
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

    const store = configureMockStore({
      preloadedState: {
        auth: {
          cdc: authCdcState,
        },
      } as RootState,
    })

    server.use(
      http.get('*/current/profile', () => {
        requestProfileCounter++
        return HttpResponse.json(
          { errors: [{ type: 'InvalidTokenError', message: 'Invalid access token' }] },
          { status: 401 },
        )
      }),
      http.post('*/accounts.getAccountInfo', () => {
        return HttpResponse.json({ id_token: 'new_id_token' }, { status: 200 })
      }),
      http.post('*/authorizationserver/oauth/token', () => {
        return HttpResponse.json({}, { status: 401 })
      }),
      http.post('*/accounts.logout', () => {
        requestLogout = true
        return HttpResponse.json({}, { status: 200 })
      }),
      http.post('*/oauth/revoke', () => HttpResponse.json({}, { status: 200 })),
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
