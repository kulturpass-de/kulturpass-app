import { aa2Module } from '@jolocom/react-native-ausweis'
import { useCallback } from 'react'

/**
 * Returns a function that cancels the current AA2 Flow if any is running
 * and disconnects the SDK
 */
export const useCancelFlow = () => {
  const cancelFlow = useCallback(async () => {
    if (aa2Module.isInitialized) {
      try {
        await aa2Module.disconnectAa2Sdk()
      } catch (e) {
        console.log(e)
      }
    }
  }, [])

  return cancelFlow
}
