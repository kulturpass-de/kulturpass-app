import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { commerceApi } from '../../api/commerce-api'
import { configureMockStore } from '../../testing/configure-mock-store'
import { pollAppConfig, pollAppConfigSubscription } from './poll-app-config'

const server = setupServer()

describe('poll-app-config', () => {
  const store = configureMockStore({ middlewares: [commerceApi.middleware] })

  beforeAll(() => {
    jest.useFakeTimers()
    server.listen()
  })
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
    store.clearActions()
  })
  afterAll(() => {
    server.close()
    jest.useRealTimers()
  })

  it('should call getAppConfig endpoint with pollingInterval', async () => {
    server.use(rest.get('http://localhost/appConfig/url', (_req, res, ctx) => res(ctx.status(200), ctx.body(''))))

    await store.dispatch(pollAppConfig())

    store.expectActions([
      {
        type: 'commerceApi/executeQuery/pending',
        meta: {
          arg: {
            endpointName: 'getAppConfig',
            subscriptionOptions: { pollingInterval: 300000 },
          },
        },
      },
    ])

    pollAppConfigSubscription?.unsubscribe()
  })
})
