import { createThunk } from '../../../redux/utils/create-thunk'
import { commerceApi } from '../../commerce-api'
import { OrderHistory } from '../../types/commerce/api-types'

export const cacheReservationsProductsDetails = createThunk<void, OrderHistory[]>(
  'apiOfflineCache/cacheReservationsProductsDetails',
  async (orderHistoryList, thunkApi) => {
    const promises = orderHistoryList.reduce<Promise<any>[]>((promisesAcc, order) => {
      const getOrderDetailPromise = thunkApi
        .dispatch(commerceApi.endpoints.getOrderDetail.initiate({ orderCode: order.code }))
        .unwrap()

      const productCode = order.entries?.[0].product?.code
      const getProductDetailPromise = productCode
        ? thunkApi.dispatch(commerceApi.endpoints.getProductDetail.initiate({ productCode })).unwrap()
        : Promise.resolve()

      return [...promisesAcc, getOrderDetailPromise, getProductDetailPromise]
    }, [])

    await Promise.all(promises)
  },
)
