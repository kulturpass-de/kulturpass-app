import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { cacheReservationsProductsDetails } from './cache-reservations-products-details'

const server = setupServer()

describe('cache-reservations-products-details', () => {
  const store = configureMockStore()

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

  it('should dispatch getOrderDetail and getProductDetail for each of the given orders', async () => {
    server.use(rest.get('*/orders/order_1', (_req, res, ctx) => res(ctx.status(200), ctx.body(''))))
    server.use(rest.get('*/orders/order_2', (_req, res, ctx) => res(ctx.status(200), ctx.body(''))))
    server.use(rest.get('*/products/geospatial/product_1', (_req, res, ctx) => res(ctx.status(200), ctx.body(''))))
    server.use(rest.get('*/products/geospatial/product_2', (_req, res, ctx) => res(ctx.status(200), ctx.body(''))))

    await store.dispatch(
      cacheReservationsProductsDetails([
        { code: 'order_1', entries: [{ product: { code: 'product_1' } }] },
        { code: 'order_2', entries: [{ product: { code: 'product_2' } }] },
      ]),
    )

    store.expectActions([
      {
        meta: { arg: { endpointName: 'getOrderDetail', originalArgs: { orderCode: 'order_1' } } },
        type: 'commerceApi/executeQuery/pending',
      },
      {
        meta: { arg: { endpointName: 'getOrderDetail', originalArgs: { orderCode: 'order_2' } } },
        type: 'commerceApi/executeQuery/pending',
      },
      {
        meta: { arg: { endpointName: 'getProductDetail', originalArgs: { productCode: 'product_1' } } },
        type: 'commerceApi/executeQuery/pending',
      },
      {
        meta: { arg: { endpointName: 'getProductDetail', originalArgs: { productCode: 'product_2' } } },
        type: 'commerceApi/executeQuery/pending',
      },
    ])
  })
})
