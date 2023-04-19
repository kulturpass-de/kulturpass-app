import { useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

const isInForeground = (appStateStatus: AppStateStatus): boolean => {
  return appStateStatus === 'active'
}

export const useAppState = (): {
  appIsInForeground: boolean
} => {
  const [appIsInForeground, setAppIsInForeground] = useState(isInForeground(AppState.currentState))

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      const newValue = isInForeground(nextAppState)
      setAppIsInForeground(newValue)
    })

    return () => subscription.remove()
  }, [])

  return { appIsInForeground }
}
