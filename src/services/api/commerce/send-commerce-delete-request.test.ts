import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { type RootState } from '../../redux/configure-store'
import { configureMockStore } from '../../testing/configure-mock-store'
import { axiosBaseQuery } from '../common/base-query'
import { type BaseQueryApi } from '../common/types'
import { sendCommerceDeleteRequest } from './send-commerce-delete-request'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('../../environment-configuration/utils', () => {
  return {
    getEnvironmentConfig: jest.fn(() => ({
      commerce: {
        baseSiteId: 'my_base_site_id',
        baseUrl: 'http://my_base_url',
      },
    })),
  }
})

test('Should send DELETE request', async () => {
  const preloadedState = {
    auth: { commerce: { access_token: 'my_access_token' } },
    persisted: {
      environmentConfiguration: {
        currentEnvironmentName: 'test',
      },
    },
  } as RootState
  const store = configureMockStore({ preloadedState })

  const arg = {}
  const api = { getState: store.getState } as BaseQueryApi
  const extraOptions = {}

  let calledApi = false

  server.use(
    http.delete('*/delete-this', () => {
      calledApi = true
      return HttpResponse.text('', { status: 200 })
    }),
  )

  const prepare = jest.fn().mockReturnValue({ path: '/delete-this' })
  const response = await sendCommerceDeleteRequest(prepare)(arg, api, extraOptions, axiosBaseQuery())

  expect(calledApi).toBeTruthy()
  expect(response.data).toBe('')
  expect(response.error).toBeUndefined()
})
