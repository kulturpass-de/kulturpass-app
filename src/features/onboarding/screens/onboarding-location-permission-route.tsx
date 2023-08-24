import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { setLastDisplayedVersion } from '../../release-notes/redux/release-notes-slice'
import { getDisplayVersion } from '../../release-notes/utils/getDisplayVersion'
import { setShowOnboardingOnStartup } from '../redux/onboarding'
import { OnboardingLocationPermissionScreen } from './onboarding-location-permission-screen'

export const OnboardingLocationPermissionRouteName = 'OnboardingLocationPermission'

export type OnboardingLocationPermissionRouteParams = undefined

export const OnboardingLocationPermissionRoute: React.FC = () => {
  const dispatch = useDispatch()

  const onNext = useCallback(() => {
    dispatch(setLastDisplayedVersion(getDisplayVersion()))
    dispatch(setShowOnboardingOnStartup(false))
  }, [dispatch])

  return <OnboardingLocationPermissionScreen onNext={onNext} />
}

export const OnboardingLocationPermissionRouteConfig = createRouteConfig({
  name: OnboardingLocationPermissionRouteName,
  component: OnboardingLocationPermissionRoute,
  options: { cardStyle: modalCardStyle },
})
