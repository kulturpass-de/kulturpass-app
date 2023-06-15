import { useCallback } from 'react'
import { AA2CommandService } from '@sap/react-native-ausweisapp2-wrapper'
import { AA2_TIMEOUTS } from '../eid-command-timeouts'

/**
 * Returns a function that cancels the current AA2 Flow if any is running
 * and disconnects the SDK
 */
export const useCancelFlow = () => {
  const cancelFlow = useCallback(async () => {
    try {
      await AA2CommandService.stop({ msTimeout: AA2_TIMEOUTS.STOP })
    } catch (e) {
      console.log(e)
    }
  }, [])

  return cancelFlow
}
