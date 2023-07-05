import { useIsFocused } from '@react-navigation/native'
import { AA2WorkflowHelper } from '@sap/react-native-ausweisapp2-wrapper'
import { useEffect, useState } from 'react'
import { env } from '../../../env'
import { ErrorWithCode } from '../../../services/errors/errors'
import { AA2_TIMEOUTS } from '../eid-command-timeouts'
import { AA2InitError, AA2Timeout, isTimeoutError } from '../errors'

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
    AA2WorkflowHelper.initializeAA2Sdk(env.AA2_DEVELOPER_MODE, 2, AA2_TIMEOUTS.INIT, AA2_TIMEOUTS.GET_SET_API_LEVEL)
      .catch(error => {
        if (error instanceof Error) {
          if (isTimeoutError(error)) {
            onError(new AA2Timeout())
          } else {
            onError(new AA2InitError())
          }
        }
        // AusweisApp2 Message errors are handled by the useHandleErrors hook
      })
      .finally(() => setIsLoading(false))
  }, [isFocused, onError])

  return { isLoading }
}
