import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { OnboardingNotificationPermissionRouteName } from '../../../screens/app/onboarding/onboarding-notification-permission-route'
import { ReleaseNotesModalRouteName } from '../../../screens/app/release-notes-modal-route'
import { getNotificationOnboardingShown } from '../../onboarding/redux/onboarding-selectors'
import { getLastDisplayedVersion } from '../redux/release-notes-selectors'
import { getDisplayVersion } from '../utils/get-display-version'

const currentDisplayedVersion = getDisplayVersion()

export const useDisplayReleaseNotes = () => {
  const modalNavigation = useModalNavigation()
  const lastDisplayedVersion = useSelector(getLastDisplayedVersion)
  const notificationOnboardingShown = useSelector(getNotificationOnboardingShown)
  const dispatch = useDispatch()

  useEffect(() => {
    if (lastDisplayedVersion !== currentDisplayedVersion) {
      modalNavigation.navigate({ screen: ReleaseNotesModalRouteName })
    } else if (!notificationOnboardingShown) {
      // Note: This is a fallback, so that even without a features screen, the Onboarding Notification could be shown
      modalNavigation.navigate({ screen: OnboardingNotificationPermissionRouteName })
    }
  }, [lastDisplayedVersion, modalNavigation, dispatch, notificationOnboardingShown])
}
