import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { AppDispatch } from '../../../services/redux/configure-store'
import { forceRefreshLocation } from '../redux/thunks/force-refresh-location'
import { LocationSharingRouteName } from '../screen/location-sharing-route'

export const useRequestLocationPopup = () => {
  const modalNavigation = useModalNavigation()
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(async () => {
    let isGranted = false
    try {
      isGranted = await dispatch(forceRefreshLocation()).unwrap()
    } catch (_error: unknown) {}
    if (!isGranted) {
      modalNavigation.navigate({ screen: LocationSharingRouteName })
    }
  }, [dispatch, modalNavigation])
}
