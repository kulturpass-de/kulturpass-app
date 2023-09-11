import { NavigatorScreenParams } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Linking } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { AppDispatch } from '../../../services/redux/configure-store'
import { selectIsInForeground } from '../../../services/redux/slices/app-core'
import { modalCardStyle } from '../../../theme/utils'
import { forceRefreshLocation } from '../redux/thunks/force-refresh-location'
import { LocationSharingScreen } from './location-sharing-screen'

export const LocationSharingRouteName = 'LocationSharing'

export type LocationSharingRouteParams = undefined

export type LocationSharingRouteStackParams = {
  ReleaseNotes: NavigatorScreenParams<LocationSharingRouteParams>
}

const LocationSharingRoute: React.FC = () => {
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
            modalNavigation.goBack()
          }
        } finally {
          setIsLoading(false)
        }
      }
      recheckLocationPermission()
    }
  }, [appIsInForeground, dispatch, modalNavigation])

  const onClose = useCallback(() => {
    modalNavigation.goBack()
  }, [modalNavigation])

  const onOpenLocationSettings = useCallback(async () => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    await Linking.openSettings()
    setIsLoading(false)
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
