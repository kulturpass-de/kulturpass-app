import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setNotificationOnboardingShown,
  setShowOnboardingOnStartup,
} from '../../../features/onboarding/redux/onboarding'
import { getShowOnboardingOnStartup } from '../../../features/onboarding/redux/onboarding-selectors'
import { setLastDisplayedVersion } from '../../../features/release-notes/redux/release-notes-slice'
import { getDisplayVersion } from '../../../features/release-notes/utils/get-display-version'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { OnboardingNotificationPermissionScreen } from './onboarding-notification-permission-screen'

export const OnboardingNotificationPermissionRouteName = 'OnboardingNotificationPermission'

export type OnboardingNotificationPermissionRouteParams = undefined

export const OnboardingNotificationPermissionRoute: React.FC = () => {
  const dispatch = useDispatch()
  const modalNavigation = useModalNavigation()
  const showOnboardingOnStartup = useSelector(getShowOnboardingOnStartup)

  const onNext = useCallback(() => {
    dispatch(setNotificationOnboardingShown(true))
    if (showOnboardingOnStartup) {
      dispatch(setLastDisplayedVersion(getDisplayVersion()))
      dispatch(setShowOnboardingOnStartup(false))
    } else {
      modalNavigation.closeModal()
    }
  }, [dispatch, modalNavigation, showOnboardingOnStartup])

  return <OnboardingNotificationPermissionScreen onNext={onNext} />
}

export const OnboardingNotificationPermissionRouteConfig = createRouteConfig({
  name: OnboardingNotificationPermissionRouteName,
  component: OnboardingNotificationPermissionRoute,
  options: { cardStyle: modalCardStyle },
})
