import { useIsFocused } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { logger } from '../../../services/logger'
import { eidAusweisApp2Service } from '../services/eid-ausweisapp2-service'
import { EidFlowResponse } from '../types'

/**
 * Initializes the SDK and sets the API Level to 2
 */
export const useInitAA2Sdk = (onError: (error: ErrorWithCode) => void) => {
  const isFocused = useIsFocused()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      return
    }

    setIsLoading(true)
    eidAusweisApp2Service
      .initAA2Sdk()
      .then(result => {
        if (result.response === EidFlowResponse.EidMessageError) {
          // AusweisApp2 Message errors are handled by the useHandleErrors hook
          logger.log('eID init AA2 SDK failed with message', result.msg.msg)
        } else {
          logger.log('eID init AA2 SDK succeeded')
        }
      })
      .catch((error: unknown) => {
        if (error instanceof ErrorWithCode) {
          onError(error)
        } else {
          logger.warn('eID init AA2 SDK error cannot be interpreted', JSON.stringify(error))
          onError(new UnknownError('eID Init'))
        }
      })
      .finally(() => setIsLoading(false))
  }, [isFocused, onError])

  return { isLoading }
}
