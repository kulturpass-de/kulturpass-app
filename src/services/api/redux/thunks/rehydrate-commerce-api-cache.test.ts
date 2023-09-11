import { RootState } from '../../../redux/configure-store'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { rehydrateCommerceApiCache } from './rehydrate-commerce-api-cache'

describe('rehydrate-commerce-api-cache', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  it('should call upsertQueryData with the cached data of getOrderDetail endpoint', async () => {
    const store = configureMockStore({
      preloadedState: {
        persisted: {
          apiOfflineCache: {
            commerceApi: {
              getOrderDetail: {
                order_1_cache_key: {
                  args: { orderCode: 'order_1' },
                  payload: { entries: [] },
                },
                order_2_cache_key: {
                  args: { orderCode: 'order_2' },
                  payload: { entries: [] },
                },
              },
            },
          },
        },
      } as any as RootState,
    })

    await store.dispatch(rehydrateCommerceApiCache()).unwrap()

    store.expectActions([
      {
        meta: { arg: { endpointName: 'getOrderDetail', originalArgs: { orderCode: 'order_1' } } },
        payload: { entries: [] },
        type: 'commerceApi/executeQuery/fulfilled',
      },
      {
        meta: { arg: { endpointName: 'getOrderDetail', originalArgs: { orderCode: 'order_2' } } },
        payload: { entries: [] },
        type: 'commerceApi/executeQuery/fulfilled',
      },
    ])
  })

  it('should call upsertQueryData with the cached data of getProductDetail endpoint', async () => {
    const store = configureMockStore({
      preloadedState: {
        persisted: {
          apiOfflineCache: {
            commerceApi: {
              getProductDetail: {
                product_1_cache_key: {
                  args: { productCode: 'product_1' },
                  payload: { code: 'product_1' },
                },
                product_2_cache_key: {
                  args: { productCode: 'product_2' },
                  payload: { code: 'product_2' },
                },
              },
            },
          },
        },
      } as any as RootState,
    })

    await store.dispatch(rehydrateCommerceApiCache()).unwrap()

    store.expectActions([
      {
        meta: { arg: { endpointName: 'getProductDetail', originalArgs: { productCode: 'product_1' } } },
        payload: { code: 'product_1' },
        type: 'commerceApi/executeQuery/fulfilled',
      },
      {
        meta: { arg: { endpointName: 'getProductDetail', originalArgs: { productCode: 'product_2' } } },
        payload: { code: 'product_2' },
        type: 'commerceApi/executeQuery/fulfilled',
      },
    ])
  })

  it('should call upsertQueryData with the cached data of getReservations endpoint', async () => {
    const store = configureMockStore({
      preloadedState: {
        persisted: {
          apiOfflineCache: {
            commerceApi: {
              getReservations: {
                reservations_cache_key: {
                  args: {},
                  payload: { orders: [{ code: 'order_1' }] },
                },
              },
            },
          },
        },
      } as any as RootState,
    })

    await store.dispatch(rehydrateCommerceApiCache()).unwrap()

    store.expectActions([
      {
        meta: { arg: { endpointName: 'getReservations', originalArgs: {} } },
        payload: { orders: [{ code: 'order_1' }] },
        type: 'commerceApi/executeQuery/fulfilled',
      },
    ])
  })
})
