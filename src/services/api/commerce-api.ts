import { createApi as createRtkApi, defaultSerializeQueryArgs } from '@reduxjs/toolkit/query/react'

import { getEnvironmentConfigurationState } from '../environment-configuration/redux/environment-configuration-selectors'
import { RootState } from '../redux/configure-store'
import { repeatRequestIfInvalidToken } from './commerce/repeat-request-if-invalid-token'
import { sendCommerceDeleteRequest } from './commerce/send-commerce-delete-request'
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
import { DeleteCartEntryParams } from './types/commerce/commerce-delete-cart-entry'
import { GetAppConfigRequestParams, GetAppConfigResponseBody } from './types/commerce/commerce-get-app-config'
import { GetOrderDetailParams, GetOrderDetailResponse } from './types/commerce/commerce-get-order-detail'
import { GetProfileRequestParams, GetProfileResponseBody } from './types/commerce/commerce-get-profile'
import { GetReservationsParams, GetReservationsResponse } from './types/commerce/commerce-get-reservations'
import { GetRandomProductParams, GetRandomProductResponse } from './types/commerce/commerce-get-random-product'

const dontRemoveOtherwiseJestTestsWillNotClose = process.env.NODE_ENV === 'test' ? { keepUnusedDataFor: 0 } : {}

export const commerceApi = createRtkApi({
  ...dontRemoveOtherwiseJestTestsWillNotClose,
  reducerPath: 'commerceApi',
  baseQuery: repeatRequestIfInvalidToken<unknown>(axiosBaseQuery),
  tagTypes: ['profile', 'reservations', 'reservation-detail', 'favorites', 'product-detail'],
  endpoints: builder => ({
    postAuthToken: builder.mutation<PostAuthTokenResponse, PostAuthTokenParams>({
      invalidatesTags: ['profile', 'favorites', 'reservations', 'reservation-detail'],
      queryFn: sendCommerceOauthTokenRequest(params => ({
        queryParams: params,
      })),
    }),
    getFavorites: builder.query<GetFavoritesResponse, GetFavoritesRequestParams>({
      providesTags: ['favorites'],
      queryFn: sendCommerceGetRequest(() => ({
        path: 'users/current/favourites',
        appendLanguageQueryParams: true,
        appendLocationQueryParams: true,
        appendNoCacheHeader: true,
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
      providesTags: (result, error, arg) => [{ type: 'product-detail', id: arg.productCode }],
    }),
    getRandomProduct: builder.query<GetRandomProductResponse, GetRandomProductParams>({
      queryFn: sendCommerceGetRequest(() => {
        return {
          path: 'products/geospatial/random',
          appendLanguageQueryParams: true,
          appendLocationQueryParams: true,
        }
      }),
    }),
    getOrderDetail: builder.query<GetOrderDetailResponse, GetOrderDetailParams>({
      providesTags: (result, error, arg) => [{ type: 'reservation-detail', id: arg.orderCode }],
      queryFn: sendCommerceGetRequest(params => ({
        path: `users/current/orders/${params.orderCode}`,
        appendNoCacheHeader: true,
      })),
    }),
    cancelReservation: builder.mutation<void, CancelReservationParams>({
      invalidatesTags: (result, error, arg) => [
        'profile',
        'reservations',
        { type: 'reservation-detail', id: arg.order.code },
      ],
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
      queryFn: sendCommerceGetRequest(queryParams => ({
        path: 'users/current/reservations',
        queryParams,
        appendNoCacheHeader: true,
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
      invalidatesTags: ['reservations'],
    }),
    getProfile: builder.query<GetProfileResponseBody, GetProfileRequestParams>({
      providesTags: ['profile'],
      serializeQueryArgs: args => {
        // Don't cache the `forceUpdate`
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { forceUpdate, ...otherQueryParams } = args.queryArgs
        return defaultSerializeQueryArgs({ ...args, queryArgs: otherQueryParams })
      },
      queryFn: sendCommerceGetRequest(queryParams => ({
        path: 'users/current',
        queryParams,
        appendNoCacheHeader: true,
      })),
    }),
    getAppConfig: builder.query<GetAppConfigResponseBody, GetAppConfigRequestParams>({
      queryFn: sendCommerceGetRequest((params, api) => {
        const rootState = api.getState() as RootState
        const environmentConfiguration = getEnvironmentConfigurationState(rootState)
        const url: string = environmentConfiguration.currentEnvironment.appConfig.url
        return { url, appendNoCacheHeader: true }
      }),
    }),
    removeProductFromCart: builder.mutation<undefined, DeleteCartEntryParams>({
      invalidatesTags: ['favorites'],
      queryFn: sendCommerceDeleteRequest(params => ({
        path: `users/current/carts/${params.cartId}/entries/${params.entryNumber}`,
      })),
    }),
  }),
})
