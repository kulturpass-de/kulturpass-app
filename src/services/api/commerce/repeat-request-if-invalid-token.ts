import { AxiosHeaders } from 'axios'
import { authCommerceLogin } from '../../auth/store/thunks/auth-commerce-login'
import { authLogoutWithoutErrors } from '../../auth/store/thunks/auth-logout'
import { getEnvironmentConfig } from '../../environment-configuration/utils'
import { ErrorWithCode, HttpStatusUnauthorizedError } from '../../errors/errors'
import { AppDispatch, RootState } from '../../redux/configure-store'
import { getAccountInfo } from '../../user/redux/thunks/get-account-info'
import { AxiosBaseQueryFn } from '../common/types'
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { PostAuthTokenResponse } from '../types'

type QueryResponse = QueryReturnValue<unknown, ErrorWithCode, {}>

const hasHttpStatusUnauthorizedError = (response: QueryResponse): boolean => {
  return response.error instanceof HttpStatusUnauthorizedError
}

const hasInvalidTokenError = (response: QueryResponse): boolean => {
  if (!hasHttpStatusUnauthorizedError(response)) {
    return false
  }

  const isTokenInvalid = (response.error as HttpStatusUnauthorizedError).errors.find(
    errorItem => errorItem.type === 'InvalidTokenError',
  )
  return Boolean(isTokenInvalid)
}

const commerceLogin = async (state: RootState, dispatch: AppDispatch): Promise<PostAuthTokenResponse> => {
  const { id_token: idToken } = await dispatch(getAccountInfo()).unwrap()
  const cdcSessionData = { ...state.auth.cdc!, idToken: idToken! }
  return dispatch(authCommerceLogin(cdcSessionData)).unwrap()
}

export const repeatRequestIfInvalidToken = <T>(baseQuery: () => AxiosBaseQueryFn<T>): AxiosBaseQueryFn<T> => {
  return async (args, api, extraOptions) => {
    const response = await baseQuery()(args, api, extraOptions)

    if (!hasInvalidTokenError(response)) {
      return response
    }

    const rootState = api.getState() as RootState

    const commerceRevocationUrl = getEnvironmentConfig(
      rootState.persisted.environmentConfiguration.currentEnvironmentName,
    ).commerce.auth.revocationEndpoint

    if (commerceRevocationUrl === args.url) {
      // Should not retry while logging out
      return response
    }

    const dispatch = api.dispatch as AppDispatch

    try {
      const commerceLoginResponse = await commerceLogin(rootState, dispatch)

      if (args.headers instanceof AxiosHeaders && args.headers.has('Authorization')) {
        args.headers.set('Authorization', `Bearer ${commerceLoginResponse.access_token}`)
      }

      const response2 = await baseQuery()(args, api, extraOptions)
      if (hasHttpStatusUnauthorizedError(response2)) {
        throw response2.error
      }
      return response2
    } catch (error: any) {
      await dispatch(authLogoutWithoutErrors()).unwrap()
      return { error }
    }
  }
}
