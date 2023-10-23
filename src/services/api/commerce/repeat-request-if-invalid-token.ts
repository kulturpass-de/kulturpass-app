import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { AxiosHeaders } from 'axios'
import { authCommerceRefreshSession } from '../../auth/store/thunks/auth-commerce-refresh-session'
import { authLogoutWithoutErrors } from '../../auth/store/thunks/auth-logout'
import { getEnvironmentConfig } from '../../environment-configuration/utils'
import { ErrorWithCode, HttpStatusUnauthorizedError } from '../../errors/errors'
import { AppDispatch, RootState } from '../../redux/configure-store'
import { AxiosBaseQueryFn } from '../common/types'

type QueryResponse = QueryReturnValue<unknown, ErrorWithCode, {}>

const hasHttpStatusUnauthorizedError = (response: QueryResponse): boolean => {
  return response.error instanceof HttpStatusUnauthorizedError
}

const hasInvalidTokenError = (response: QueryResponse): boolean => {
  if (!hasHttpStatusUnauthorizedError(response)) {
    return false
  }

  const isTokenInvalid = (response.error as HttpStatusUnauthorizedError).errors?.find(
    errorItem => errorItem.type === 'InvalidTokenError',
  )
  return Boolean(isTokenInvalid)
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
      const commerceLoginResponse = await dispatch(authCommerceRefreshSession(rootState.auth.cdc!)).unwrap()

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
