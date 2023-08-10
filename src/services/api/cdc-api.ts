import { createApi } from '@reduxjs/toolkit/query/react'
import { callCdcWithApiKey } from './cdc/call-cdc-with-api-key'
import { callCdcWithCustomSessionInfoSigned } from './cdc/call-cdc-with-custom-session-info-signed'
import { callCdcWithSessionInfoSigned } from './cdc/call-cdc-with-session-info-signed'
import { axiosBaseQuery } from './common/base-query'
import {
  AccountsGetAccountInfoResponse,
  AccountsInitRegistrationRequestParams,
  AccountsInitRegistrationResponse,
  AccountsLoginRequestParams,
  AccountsLoginResponse,
  AccountsLogoutRequestParams,
  AccountsLogoutResponse,
  AccountsRegisterRequestParams,
  AccountsRegisterResponse,
  AccountsSetAccountInfoResponse,
  AccountsSetAccountInfoSignedRequestParams,
  AccountsSetAccountInfoWithCustomSessionSignedRequestParams,
  AccountsSetAccountInfoWithRegTokenUnsignedRequestParams,
} from './types'
import {
  AccountsFinalizeRegistrationRequestParams,
  AccountsFinalizeRegistrationResponse,
} from './types/cdc/accounts/cdc-accounts-finalize-registration'
import {
  AccountsResetPasswordRequestParams,
  AccountsResetPasswordResponse,
} from './types/cdc/accounts/cdc-accounts-reset-password'
import { CdcApiBaseSuccessResponse } from './types/cdc/cdc-api-base-success-response'

// TODO: extract cdc constant
export const CDC_SESSION_EXPIRATION_INIFINITE = -2

const dontRemoveOtherwiseJestTestsWillNotClose = process.env.NODE_ENV === 'test' ? { keepUnusedDataFor: 0 } : {}

export const cdcApi = createApi({
  ...dontRemoveOtherwiseJestTestsWillNotClose,
  reducerPath: 'cdcApi',
  baseQuery: axiosBaseQuery<CdcApiBaseSuccessResponse>(),
  tagTypes: ['AccountInfo', 'AccountInfo.initRegistration'],
  endpoints: builder => ({
    accountsLogin: builder.mutation<AccountsLoginResponse, AccountsLoginRequestParams>({
      queryFn: callCdcWithApiKey(params => ({
        path: 'accounts.login',
        bodyPayload: {
          loginID: params.loginID,
          password: params.password,
          include: 'profile,data,id_token',
          sessionExpiration: CDC_SESSION_EXPIRATION_INIFINITE,
        },
      })),
    }),
    accountsLogoutSigned: builder.mutation<AccountsLogoutResponse, AccountsLogoutRequestParams>({
      queryFn: callCdcWithSessionInfoSigned(() => ({
        path: 'accounts.logout',
      })),
    }),
    accountsInitRegistration: builder.query<AccountsInitRegistrationResponse, AccountsInitRegistrationRequestParams>({
      queryFn: callCdcWithApiKey(() => ({
        path: 'accounts.initRegistration',
      })),
    }),
    accountsRegister: builder.mutation<AccountsRegisterResponse, AccountsRegisterRequestParams>({
      queryFn: callCdcWithApiKey(params => ({
        path: 'accounts.register',
        bodyPayload: {
          ...params,
          include: 'profile,data,id_token',
          sessionExpiration: CDC_SESSION_EXPIRATION_INIFINITE,
          finalizeRegistration: true,
          preferences: {
            terms: { 'eula-v1': { isConsentGranted: true } },
            privacy: { 'dps-v1': { isConsentGranted: true } },
          },
        },
      })),
    }),
    accountsFinalizeRegistration: builder.mutation<
      AccountsFinalizeRegistrationResponse,
      AccountsFinalizeRegistrationRequestParams
    >({
      queryFn: callCdcWithApiKey(params => ({
        path: 'accounts.finalizeRegistration',
        bodyPayload: {
          include: 'profile,data,id_token',
          regToken: params.regToken,
        },
      })),
    }),
    accountsGetAccountInfoWithRegTokenUnsigned: builder.query<AccountsGetAccountInfoResponse, { regToken: string }>({
      queryFn: callCdcWithApiKey(params => ({
        path: 'accounts.getAccountInfo',
        bodyPayload: {
          regToken: params.regToken,
          include: 'profile,data,id_token',
        },
      })),
      providesTags: ['AccountInfo'],
    }),
    accountsGetAccountInfoSigned: builder.query<AccountsGetAccountInfoResponse, void>({
      queryFn: callCdcWithSessionInfoSigned(() => ({
        path: 'accounts.getAccountInfo',
        bodyPayload: {
          include: 'profile,data,id_token',
        },
      })),
      providesTags: ['AccountInfo'],
    }),
    accountsSetAccountInfoWithRegTokenUnsigned: builder.mutation<
      AccountsSetAccountInfoResponse,
      AccountsSetAccountInfoWithRegTokenUnsignedRequestParams
    >({
      queryFn: callCdcWithApiKey(params => ({
        path: 'accounts.setAccountInfo',
        bodyPayload: {
          profile: params.profile,
          data: params.data,
          password: params.password,
          newPassword: params.newPassword,
          regToken: params.regToken,
        },
      })),
      invalidatesTags: ['AccountInfo'],
    }),
    accountsSetAccountInfoSigned: builder.mutation<
      AccountsSetAccountInfoResponse,
      AccountsSetAccountInfoSignedRequestParams
    >({
      queryFn: callCdcWithSessionInfoSigned(params => ({
        path: 'accounts.setAccountInfo',
        bodyPayload: {
          profile: params.profile,
          data: params.data,
          password: params.password,
          newPassword: params.newPassword,
        },
      })),
      invalidatesTags: ['AccountInfo'],
    }),
    accountsSetAccountInfoWithCustomSessionSigned: builder.mutation<
      AccountsSetAccountInfoResponse,
      AccountsSetAccountInfoWithCustomSessionSignedRequestParams
    >({
      queryFn: callCdcWithCustomSessionInfoSigned(params => ({
        path: 'accounts.setAccountInfo',
        bodyPayload: {
          profile: params.profile,
          data: params.data,
          password: params.password,
          newPassword: params.newPassword,
        },
        sessionSecret: params.sessionSecret,
        sessionToken: params.sessionToken,
      })),
      invalidatesTags: ['AccountInfo'],
    }),
    accountsGetSchema: builder.query({
      queryFn: callCdcWithApiKey(() => ({
        path: 'accounts.getSchema',
      })),
    }),
    accountsResetPassword: builder.mutation<AccountsResetPasswordResponse, AccountsResetPasswordRequestParams>({
      queryFn: callCdcWithApiKey(params => ({
        path: 'accounts.resetPassword',
        bodyPayload: params,
      })),
    }),
    accountsResendVerificationCode: builder.query<CdcApiBaseSuccessResponse, { regToken: string }>({
      queryFn: callCdcWithApiKey(params => ({
        path: 'accounts.resendVerificationCode',
        bodyPayload: params,
      })),
    }),
  }),
})
