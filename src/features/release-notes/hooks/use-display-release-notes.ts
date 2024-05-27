import { useIsFocused } from '@react-navigation/native'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { OnboardingNotificationPermissionRouteName } from '../../../screens/app/onboarding/onboarding-notification-permission-route'
import { ReleaseNotesModalRouteName } from '../../../screens/app/release-notes-modal-route'
import { getNotificationOnboardingShown } from '../../../services/redux/selectors/onboarding-selectors'
import { useShouldDisplayEditorialEmailConsentModal } from '../../delta-onboarding/hooks/use-should-display-editorial-email-consent-modal'
import { getShouldShowDeltaOnboardingPushNotification } from '../../delta-onboarding/redux/delta-onboarding-selectors'
import { EditorialEmailConsentModalRouteName } from '../../delta-onboarding/screens/editorial-email-consent-modal-route'
import { getLastDisplayedVersion } from '../redux/release-notes-selectors'
import { getDisplayVersion } from '../utils/get-display-version'

const currentDisplayedVersion = getDisplayVersion()

const SHOW_CONSENT_DELAY_MS = 500

export const useDisplayReleaseNotes = () => {
  const modalNavigation = useModalNavigation()
  const lastDisplayedVersion = useSelector(getLastDisplayedVersion)
  const notificationOnboardingShown = useSelector(getNotificationOnboardingShown)
  const shouldShowDeltaOnboardingPushNotification = useSelector(getShouldShowDeltaOnboardingPushNotification)
  const shouldDisplayEditorialEmailConsentModal = useShouldDisplayEditorialEmailConsentModal()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  useEffect(() => {
    if (lastDisplayedVersion !== currentDisplayedVersion) {
      modalNavigation.navigate({ screen: ReleaseNotesModalRouteName })
    } else if (isFocused && (!notificationOnboardingShown || shouldShowDeltaOnboardingPushNotification)) {
      // Note: This is a fallback, so that even without a features screen, the Onboarding Notification could be shown
      const timeout = setTimeout(() => {
        modalNavigation.navigate({ screen: OnboardingNotificationPermissionRouteName })
      }, SHOW_CONSENT_DELAY_MS)

      return () => {
        clearTimeout(timeout)
      }
    } else if (shouldDisplayEditorialEmailConsentModal && isFocused) {
      const timeout = setTimeout(() => {
        modalNavigation.navigate({ screen: EditorialEmailConsentModalRouteName })
      }, SHOW_CONSENT_DELAY_MS)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [
    lastDisplayedVersion,
    modalNavigation,
    dispatch,
    notificationOnboardingShown,
    shouldDisplayEditorialEmailConsentModal,
    isFocused,
    shouldShowDeltaOnboardingPushNotification,
  ])
}
