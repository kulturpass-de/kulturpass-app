import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { commerceApi } from '../api/commerce-api'
import { getIsUserLoggedIn } from '../auth/store/auth-selectors'
import { CcGetProfileError } from '../errors/cc-errors'
import { ErrorWithCode, HttpStatusBadRequestError, UnknownError } from '../errors/errors'
import { logger } from '../logger'

export const useGetProfile = () => {
  const isLoggedIn = useSelector(getIsUserLoggedIn)

  const { data, refetch: intRefetch, error: intError } = commerceApi.useGetProfileQuery({}, { skip: !isLoggedIn })

  const error: ErrorWithCode | undefined = useMemo(() => {
    if (intError === undefined) {
      return undefined
    }

    if (intError instanceof ErrorWithCode) {
      if (intError instanceof HttpStatusBadRequestError) {
        return new CcGetProfileError(intError.errors?.[0]?.message)
      } else {
        return intError
      }
    } else {
      logger.warn('get profile error cannot be interpreted', JSON.stringify(error))
      return new UnknownError('Get Profile')
    }
  }, [intError])

  const refetch = useCallback(() => {
    if (isLoggedIn) {
      intRefetch()
    }
  }, [intRefetch, isLoggedIn])

  return { data, refetch, error }
}
