import { aa2Module } from '@jolocom/react-native-ausweis'
import { useEffect, useState } from 'react'
import { env } from '../../../env'
import { useIsFocused } from '@react-navigation/native'

/**
 * Initializes the SDK and sets the API Level to 2
 * If the SDK throws an error while initializing it is already initialized
 * on the native side (can happen on reload).
 */
export const useInitAA2Sdk = () => {
  const isFocused = useIsFocused()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      return
    }

    setIsLoading(true)
    const init = async () => {
      aa2Module.enableLogger(env.AA2_DEVELOPER_MODE)
      try {
        if (!aa2Module.isInitialized) {
          await aa2Module.initAa2Sdk()
        }
      } catch {
        try {
          await aa2Module.disconnectAa2Sdk()
          await aa2Module.initAa2Sdk()
        } catch (e) {
          console.log(e)
        }
      }

      try {
        const apiLevel = await aa2Module.getAPILevel()
        if (!apiLevel.available.includes(2)) {
          throw new Error('API Level 2 not available in AusweisApp2 SDK')
        } else if (apiLevel.current !== 2) {
          await aa2Module.setAPILevel(2)
        }
      } catch (e) {
        console.log(e)
      }
      setIsLoading(false)
    }
    init()
  }, [isFocused])

  return { isLoading }
}
