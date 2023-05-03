import { createApi as createRtkApi } from '@reduxjs/toolkit/query/react'

import { getEnvironmentConfigurationState } from '../environment-configuration/redux/environment-configuration-selectors'
import { RootState } from '../redux/configure-store'
import { repeatRequestIfInvalidToken } from './commerce/repeat-request-if-invalid-token'
import { sendCommerceGetRequest } from './commerce/send-commerce-get-request'
import { sendCommerceOauthTokenRequest } from './commerce/send-commerce-oauth-token-request'
import { sendCommercePostRequest } from './commerce/send-commerce-post-request'
import { axiosBaseQuery } from './common/base-query'
import {
  GetFavoritesRequestParams,
  GetFavoritesResponse,
  GetPreferenceCategoriesRequestParams,
  GetPreferenceCategoriesResponse,
  GetProductDetailParams,
  GetProductDetailResponse,
  PostAuthTokenParams,
  PostAuthTokenResponse,
} from './types'
import { Order } from './types/commerce/api-types'
import { CancelReservationParams } from './types/commerce/commerce-cancel-reservation'
import { CreateReservationParams } from './types/commerce/commerce-create-reservation'
import { GetAppConfigRequestParams, GetAppConfigResponseBody } from './types/commerce/commerce-get-app-config'
import { GetOrderDetailParams, GetOrderDetailResponse } from './types/commerce/commerce-get-order-detail'
import { GetProfileRequestParams, GetProfileResponseBody } from './types/commerce/commerce-get-profile'
import { GetReservationsParams, GetReservationsResponse } from './types/commerce/commerce-get-reservations'

export const commerceApi = createRtkApi({
  reducerPath: 'commerceApi',
  baseQuery: repeatRequestIfInvalidToken<unknown>(axiosBaseQuery),
  tagTypes: ['profile', 'reservations', 'reservation-detail'],
  endpoints: builder => ({
    postAuthToken: builder.mutation<PostAuthTokenResponse, PostAuthTokenParams>({
      queryFn: sendCommerceOauthTokenRequest(params => ({
        queryParams: params,
      })),
    }),
    getFavorites: builder.query<GetFavoritesResponse, GetFavoritesRequestParams>({
      queryFn: sendCommerceGetRequest(() => ({
        path: 'users/current/carts',
        queryParams: { fields: 'FULL' },
      })),
    }),
    getProductDetail: builder.query<GetProductDetailResponse, GetProductDetailParams>({
      queryFn: sendCommerceGetRequest(params => {
        return {
          path: `products/geospatial/${params.productCode}`,
          appendLanguageQueryParams: true,
          appendLocationQueryParams: true,
        }
      }),
    }),
    getOrderDetail: builder.query<GetOrderDetailResponse, GetOrderDetailParams>({
      providesTags: ['reservation-detail'],
      queryFn: sendCommerceGetRequest(params => ({
        path: `users/current/orders/${params.orderCode}`,
      })),
    }),
    cancelReservation: builder.mutation<void, CancelReservationParams>({
      invalidatesTags: ['profile', 'reservations', 'reservation-detail'],
      queryFn: sendCommercePostRequest(params => {
        if (!params.order.code) {
          throw new Error("Can't cancel the reservation due of missing a code in order.")
        }
        const firstEntry = params.order.entries?.[0]
        if (!firstEntry) {
          throw new Error("Can't cancel the reservation due of missing an entry in order.")
        }
        return {
          path: `users/current/orders/${params.order.code}/cancellation`,
          bodyPayload: {
            cancellationRequestEntryInputs: [
              { orderEntryNumber: firstEntry.entryNumber, quantity: firstEntry.quantity },
            ],
          },
        }
      }),
    }),
    getReservations: builder.query<GetReservationsResponse, GetReservationsParams>({
      providesTags: ['reservations'],
      queryFn: sendCommerceGetRequest(() => ({
        path: 'users/current/reservations',
      })),
    }),
    getPreferenceCategories: builder.query<GetPreferenceCategoriesResponse, GetPreferenceCategoriesRequestParams>({
      queryFn: sendCommerceGetRequest(() => ({
        path: 'categories/availablePreferences',
        appendLanguageQueryParams: true,
      })),
    }),
    createReservation: builder.mutation<Order, CreateReservationParams>({
      queryFn: sendCommercePostRequest(params => ({
        path: 'users/current/reservations',
        queryParams: params,
      })),
    }),
    getProfile: builder.query<GetProfileResponseBody, GetProfileRequestParams>({
      providesTags: ['profile'],
      queryFn: sendCommerceGetRequest(() => ({
        path: 'users/current',
      })),
    }),
    getAppConfig: builder.query<GetAppConfigResponseBody, GetAppConfigRequestParams>({
      queryFn: sendCommerceGetRequest((params, api) => {
        const rootState = api.getState() as RootState
        const environmentConfiguration = getEnvironmentConfigurationState(rootState)
        const url: string = environmentConfiguration.currentEnvironment.appConfig.url
        return { url }
      }),
    }),
  }),
})
