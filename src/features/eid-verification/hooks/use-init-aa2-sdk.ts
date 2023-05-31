import { useEffect, useState } from 'react'
import { env } from '../../../env'
import { useIsFocused } from '@react-navigation/native'
import { AA2WorkflowHelper } from '@sap/react-native-ausweisapp2-wrapper'

/**
 * Initializes the SDK and sets the API Level to 2
 */
export const useInitAA2Sdk = () => {
  const isFocused = useIsFocused()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      return
    }

    setIsLoading(true)
    AA2WorkflowHelper.initializeAA2Sdk(env.AA2_DEVELOPER_MODE, 2)
      .catch(console.warn)
      .finally(() => setIsLoading(false))
  }, [isFocused])

  return { isLoading }
}
