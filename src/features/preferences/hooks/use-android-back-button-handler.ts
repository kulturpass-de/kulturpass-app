import { useEffect } from 'react'
import { BackHandler } from 'react-native'

export const useAndroidBackButtonHandler = (handler: () => boolean) => {
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', handler)
    return () => subscription.remove()
  }, [handler])
}
