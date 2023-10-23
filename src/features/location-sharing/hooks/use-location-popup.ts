import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { LocationSharingRouteName } from '../../../screens/account/preferences/location-sharing-route'
import { AppDispatch } from '../../../services/redux/configure-store'
import { forceRefreshLocation } from '../redux/thunks/force-refresh-location'

export const useRequestLocationPopup = (onLocationPopupFinished?: (isGranted: boolean) => void) => {
  const modalNavigation = useModalNavigation()
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(async () => {
    let isGranted = false
    try {
      isGranted = await dispatch(forceRefreshLocation()).unwrap()
    } catch (_error: unknown) {}
    if (!isGranted) {
      modalNavigation.navigate({ screen: LocationSharingRouteName, params: { onFinished: onLocationPopupFinished } })
    } else {
      onLocationPopupFinished?.(isGranted)
    }
  }, [dispatch, modalNavigation, onLocationPopupFinished])
}
