import { NavigatorScreenParams } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Linking, LogBox } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { AppDispatch } from '../../../services/redux/configure-store'
import { selectIsInForeground } from '../../../services/redux/slices/app-core'
import { modalCardStyle } from '../../../theme/utils'
import { forceRefreshLocation } from '../redux/thunks/force-refresh-location'
import { LocationSharingScreen } from './location-sharing-screen'

// This screen is not deeplinked into, so we can use a function parameter
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])

export const LocationSharingRouteName = 'LocationSharing'

export type LocationSharingRouteParams = {
  onFinished?: (isGranted: boolean) => void
}

export type LocationSharingRouteStackParams = {
  ReleaseNotes: NavigatorScreenParams<LocationSharingRouteParams>
}

export type LocationSharingRouteProps = ModalScreenProps<'LocationSharing'>
const LocationSharingRoute: React.FC<LocationSharingRouteProps> = ({ route }) => {
  const { params } = route
  const modalNavigation = useModalNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const appIsInForeground = useSelector(selectIsInForeground)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (appIsInForeground && modalNavigation.isFocused()) {
      const recheckLocationPermission = async () => {
        try {
          setIsLoading(true)
          const isGranted = await dispatch(forceRefreshLocation()).unwrap()
          if (isGranted) {
            params.onFinished?.(isGranted)
            modalNavigation.goBack()
          }
        } finally {
          setIsLoading(false)
        }
      }
      recheckLocationPermission()
    }
  }, [appIsInForeground, dispatch, modalNavigation, params])

  const onClose = useCallback(() => {
    modalNavigation.goBack()
  }, [modalNavigation])

  const onOpenLocationSettings = useCallback(async () => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    try {
      await Linking.openSettings()
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  return (
    <>
      <LoadingIndicator loading={isLoading} />
      <LocationSharingScreen onClose={onClose} onOpenLocationSettings={onOpenLocationSettings} isLoading={isLoading} />
    </>
  )
}

export const LocationSharingRouteConfig = createRouteConfig({
  name: LocationSharingRouteName,
  component: LocationSharingRoute,
  options: { cardStyle: modalCardStyle },
})
