import { AppState, AppStateStatus } from 'react-native'
import { logger } from '../../logger'
import { AppStore } from '../configure-store'
import { appCoreSlice } from '../slices/app-core'

const isInForeground = (appStateStatus: AppStateStatus) => {
  return appStateStatus === 'active'
}

export const subscribeToAppState = (store: AppStore['store']) => {
  const subscription = AppState.addEventListener('change', nextAppState => {
    logger.log('AppState changed', nextAppState)
    const newValue = isInForeground(nextAppState)
    store.dispatch(appCoreSlice.actions.setIsInForeground(newValue))
  })

  return subscription
}
