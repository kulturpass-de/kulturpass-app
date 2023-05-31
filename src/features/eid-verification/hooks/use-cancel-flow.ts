import { useCallback } from 'react'
import { AA2CommandService } from '@sap/react-native-ausweisapp2-wrapper'

/**
 * Returns a function that cancels the current AA2 Flow if any is running
 * and disconnects the SDK
 */
export const useCancelFlow = () => {
  const cancelFlow = useCallback(async () => {
    try {
      await AA2CommandService.stop()
    } catch (e) {
      console.log(e)
    }
  }, [])

  return cancelFlow
}
