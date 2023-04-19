import { createApi as createRtkApi } from '@reduxjs/toolkit/query/react'
import type {
  CommerceAuthResponse,
  CommerceAuthParams,
  GetFavoritesResponse,
  GetFavoritesRequestParams,
  GetPreferenceCategoriesResponse,
  GetPreferenceCategoriesRequestParams,
  GetProductDetailResponse,
  GetProductDetailParams,
} from './types'
import { getEnvironmentConfigurationCommerce } from '../environment-configuration/redux/environment-configuration-selectors'
import type { RootState } from '../redux/configure-store'
import { type ExtraOptions, type FetchArgs } from './api'
import { axiosBaseQuery } from './api-base-query'
import { GetReservationsParams, GetReservationsResponse } from './types/commerce/commerce-reservations'
import { ReservationParams } from './types/commerce/commerce-reservation'
import { GetProfileRequestParams, GetProfileResponseBody } from './types/commerce/commerce-profile'
import { Order } from './types/commerce/api-types'
import {
  CancelReservationParams,
  GetOrderDetailParams,
  GetOrderDetailResponse,
} from './types/commerce/commerce-order-detail'

export const commerceApi = createRtkApi({
  reducerPath: 'commerceApi',
  /**
   * @see {@link https://redux-toolkit.js.org/rtk-query/usage/customizing-queries}
   **/
  baseQuery: (args: FetchArgs, api, extraOptions: ExtraOptions = {}) => {
    const rootState = api.getState() as RootState
    const commerce = getEnvironmentConfigurationCommerce(rootState)
    const rawBaseQuery = axiosBaseQuery({ baseUrl: commerce.baseUrl })

    args.headers = args.headers || {}

    if (extraOptions.skipAuth !== true) {
      if (rootState.auth.commerce === null) {
        throw new Error('Missing auth')
      }

      args.headers.Authorization = `Bearer ${rootState.auth.commerce.access_token}`
    }

    if (args.method === 'POST') {
      args.headers['Content-Type'] = 'application/json'

      const urlParams = new URLSearchParams(args.params || {})
      args.url += `?${urlParams}`
      args.params = null
    }

    return rawBaseQuery(args, api, extraOptions)
  },
  tagTypes: ['profile', 'reservations', 'reservation-detail'],
  endpoints: builder => ({
    postAuthToken: builder.mutation<CommerceAuthResponse, CommerceAuthParams>({
      query: ({ url, ...params }) => ({
        url,
        method: 'POST',
        params,
      }),
      extraOptions: {
        skipAuth: true,
      },
    }),
    getFavorites: builder.query<GetFavoritesResponse, GetFavoritesRequestParams>({
      query: ({ baseSiteId }) => {
        return {
          url: `/${baseSiteId}/users/current/carts`,
          method: 'GET',
          params: {
            fields: 'FULL',
          },
        }
      },
    }),
    getProductDetail: builder.query<GetProductDetailResponse, GetProductDetailParams>({
      query: ({ baseSiteId, productCode, language, location, preferredPostalCode }) => {
        let userLocation: string | undefined
        if (location) {
          userLocation = `${location.coords.latitude},${location.coords.longitude}`
        }
        return {
          url: `/${baseSiteId}/products/geospatial/${productCode}`,
          method: 'GET',
          params: {
            lang: language,
            userLocation,
            postalCode: userLocation ? undefined : preferredPostalCode,
          },
        }
      },
      extraOptions: {
        skipAuth: true,
      },
    }),
    getOrderDetail: builder.query<GetOrderDetailResponse, GetOrderDetailParams>({
      providesTags: ['reservation-detail'],
      query: ({ baseSiteId, userId, orderCode }) => {
        return {
          url: `/${baseSiteId}/users/${userId}/orders/${orderCode}`,
          method: 'GET',
          params: {},
        }
      },
    }),
    cancelReservation: builder.mutation<null, CancelReservationParams>({
      invalidatesTags: ['profile', 'reservations', 'reservation-detail'],
      query: ({ baseSiteId, userId, order }) => {
        if (!order.code) {
          throw new Error("Can't cancel the reservation due of missing a code in order.")
        }
        const firstEntry = order.entries?.[0]
        if (!firstEntry) {
          throw new Error("Can't cancel the reservation due of missing an entry in order.")
        }
        return {
          url: `/${baseSiteId}/users/${userId}/orders/${order.code}/cancellation`,
          method: 'POST',
          data: {
            cancellationRequestEntryInputs: [
              {
                orderEntryNumber: firstEntry.entryNumber,
                quantity: firstEntry.quantity,
              },
            ],
          },
        }
      },
    }),
    getReservations: builder.query<GetReservationsResponse, GetReservationsParams>({
      providesTags: ['reservations'],
      query: ({ baseSiteId, statuses }) => {
        return {
          url: `/${baseSiteId}/users/current/reservations`,
          method: 'GET',
          params: {
            statuses,
          },
        }
      },
    }),
    getPreferenceCategories: builder.query<GetPreferenceCategoriesResponse, GetPreferenceCategoriesRequestParams>({
      query: ({ baseSiteId, lang }) => {
        return {
          url: `/${baseSiteId}/categories/availablePreferences`,
          method: 'GET',
          params: {
            lang: lang === 'de' ? 'de' : 'en',
          },
        }
      },
      extraOptions: {
        skipAuth: true,
      },
    }),
    reservation: builder.mutation<Order, ReservationParams>({
      query: ({ baseSiteId, offerCode }) => {
        return {
          url: `/${baseSiteId}/users/current/reservations`,
          method: 'POST',
          params: {
            offerCode,
          },
        }
      },
    }),
    profile: builder.query<GetProfileResponseBody, GetProfileRequestParams>({
      providesTags: ['profile'],
      query: ({ baseSiteId, force }) => ({
        url: `/${baseSiteId}/users/current`,
        params: { force },
      }),
    }),
  }),
})

export type CommerceApiType = typeof commerceApi
