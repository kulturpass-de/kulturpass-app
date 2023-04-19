import { createApi as createRtkApi } from '@reduxjs/toolkit/query/react'

import { createNonce } from './utils/createNonce'

import { RootState } from '../redux/configure-store'
import { getEnvironmentConfigurationCdc } from '../environment-configuration/redux/environment-configuration-selectors'
import { type ExtraOptions, type FetchArgs } from './api'
import { axiosBaseQuery } from './api-base-query'
import {
  CdcApiLoginSuccessResponse,
  LoginRequest,
  AccountsRegisterResponse,
  AccountsRegisterRequestParams,
  AccountsInitRegistrationRequestParams,
  AccountsInitRegistrationResponse,
  AccountsSetAccountInfoResponse,
  AccountsSetAccountInfoRequestParams,
  AccountsGetAccountInfoResponse,
  AccountsGetAccountInfoRequestParams,
} from './types'
import { CdcResponseErrorSchema, createCdcErrorFromSchema } from '../errors/cdc-errors'
import { calculateSignature } from './utils/calculateSignature'
import {
  AccountsResetPasswordRequestParams,
  AccountsResetPasswordResponse,
} from './types/cdc/accounts/cdc-accounts-reset-password'
import { CdcApiBaseSuccessResponse } from './types/cdc/cdc-api-base-success-response'
import { getCdcSessionData } from '../auth/store/auth-selectors'

const currentTimestamp = () => Math.round(new Date().getTime() / 1000).toString()

// TODO: extract cdc constant
export const CDC_SESSION_EXPIRATION_INIFINITE = -2

export const cdcApi = createRtkApi({
  reducerPath: 'cdcApi',
  /**
   * @see {@link https://redux-toolkit.js.org/rtk-query/usage/customizing-queries}
   **/
  baseQuery: async (args: FetchArgs, api, extraOptions: ExtraOptions = {}) => {
    const rootState = api.getState() as RootState
    const cdc = getEnvironmentConfigurationCdc(rootState)
    const cdcSessionData = getCdcSessionData(rootState)
    const rawBaseQuery = axiosBaseQuery({ baseUrl: cdc.baseUrl })

    args.headers = args.headers || {}
    args.params = args.params || {}
    args.params.apiKey = cdc.apiKey
    args.params.targetEnv = 'mobile'

    if (
      extraOptions.sign &&
      cdcSessionData?.sessionSecret &&
      cdcSessionData?.sessionToken &&
      args.method &&
      !args.params.regToken
    ) {
      args.params.oauth_token = cdcSessionData.sessionToken
      args.params.sig = calculateSignature(
        cdcSessionData.sessionSecret,
        args.method,
        `${cdc.baseUrl}/${args.url}`,
        args.params,
      )
    }

    if (args.method === 'POST') {
      args.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    const response = await rawBaseQuery(args, api, extraOptions)

    const errorResult = CdcResponseErrorSchema.safeParse(response.data)
    if (errorResult.success) {
      return {
        error: createCdcErrorFromSchema(errorResult.data),
      }
    }

    return response
  },
  tagTypes: ['AccountInfo'],
  endpoints: builder => ({
    postLogin: builder.mutation<CdcApiLoginSuccessResponse, LoginRequest>({
      query: ({ loginId, password }) => ({
        url: 'accounts.login',
        method: 'POST',
        params: {
          loginId,
          password,
          include: 'profile,data,id_token',
          sessionExpiration: CDC_SESSION_EXPIRATION_INIFINITE,
          targetEnv: 'mobile',
        },
      }),
    }),
    accountsInitRegistration: builder.query<AccountsInitRegistrationResponse, AccountsInitRegistrationRequestParams>({
      query: () => ({
        url: 'accounts.initRegistration',
        params: {
          timestamp: currentTimestamp(),
          nonce: createNonce(),
        },
      }),
    }),
    accountsRegister: builder.mutation<AccountsRegisterResponse, AccountsRegisterRequestParams>({
      query: ({ profile, ...queryParams }) => ({
        url: 'accounts.register',
        params: {
          ...queryParams,
          profile: JSON.stringify(profile),
          include: 'profile,data,id_token',
          sessionExpiration: CDC_SESSION_EXPIRATION_INIFINITE,
          finalizeRegistration: true,
          timestamp: currentTimestamp(),
          nonce: createNonce(),
          preferences: {
            terms: {
              'eula-v1': { isConsentGranted: true },
            },
            privacy: {
              'dps-v1': { isConsentGranted: true },
            },
          },
        },
      }),
    }),
    accountsGetAccountInfo: builder.query<AccountsGetAccountInfoResponse, AccountsGetAccountInfoRequestParams>({
      query: ({ regToken }) => {
        const params = regToken ? { regToken } : {}
        return {
          url: 'accounts.getAccountInfo',
          method: 'POST',
          params: {
            ...params,
            include: 'profile,data,id_token',
            timestamp: currentTimestamp(),
            nonce: createNonce(),
          },
        }
      },
      extraOptions: {
        sign: true,
      },
      providesTags: ['AccountInfo'],
    }),
    accountsSetAccountInfo: builder.mutation<AccountsSetAccountInfoResponse, AccountsSetAccountInfoRequestParams>({
      query: ({ profile, data, regToken }) => {
        const params: Record<string, unknown> = {
          timestamp: currentTimestamp(),
          nonce: createNonce(),
        }

        if (profile) {
          params.profile = JSON.stringify(profile)
        }

        if (data) {
          params.data = JSON.stringify(data)
        }

        const sessionParams = regToken ? { regToken } : {}

        return {
          url: 'accounts.setAccountInfo',
          method: 'POST',
          params: { ...params, ...sessionParams },
        }
      },
      extraOptions: {
        sign: true,
      },
      invalidatesTags: ['AccountInfo'],
    }),
    accountsGetSchema: builder.query({
      query: () => ({
        url: 'accounts.getSchema',
        params: {
          timestamp: currentTimestamp(),
          nonce: createNonce(),
        },
      }),
    }),
    accountsResetPassword: builder.query<AccountsResetPasswordResponse, AccountsResetPasswordRequestParams>({
      // NOTE: GET works, but should be rather POST / mutation?
      query: ({ email }) => ({
        url: 'accounts.resetPassword',
        params: {
          timestamp: currentTimestamp(),
          nonce: createNonce(),
          loginId: email,
        },
      }),
    }),
    accountsResendVerificationCode: builder.query<CdcApiBaseSuccessResponse, { regToken: string }>({
      query: ({ regToken }) => ({
        url: 'accounts.resendVerificationCode',
        params: {
          regToken,
        },
      }),
    }),
  }),
})

export type CdcApiType = typeof cdcApi
