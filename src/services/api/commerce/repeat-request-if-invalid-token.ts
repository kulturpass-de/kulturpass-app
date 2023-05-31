import { authCommerceLogin } from '../../auth/store/thunks/auth-commerce-login'
import { authLogout } from '../../auth/store/thunks/auth-logout'
import { HttpStatusUnauthorizedError } from '../../errors/errors'
import { AppDispatch, RootState } from '../../redux/configure-store'
import { AxiosBaseQueryFn } from '../common/types'

export const repeatRequestIfInvalidToken = <T>(baseQuery: () => AxiosBaseQueryFn<T>): AxiosBaseQueryFn<T> => {
  return async (args, api, extraOptions) => {
    const response = await baseQuery()(args, api, extraOptions)

    if (!(response.error instanceof HttpStatusUnauthorizedError)) {
      return response
    }

    const isTokenInvalid = response.error.errors.find(errorItem => errorItem.type === 'InvalidTokenError')
    if (!isTokenInvalid) {
      return response
    }

    const rootState = api.getState() as RootState
    const dispatch = api.dispatch as AppDispatch

    try {
      await dispatch(authCommerceLogin(rootState.auth.cdc!)).unwrap()
      const response2 = await baseQuery()(args, api, extraOptions)
      if (response2.error) {
        throw response2.error
      }
      return response2
    } catch (error: any) {
      await dispatch(authLogout())
      return { error }
    }
  }
}
