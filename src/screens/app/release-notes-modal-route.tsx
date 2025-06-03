import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDeltaPushNotificationsOnboardingShown } from '../../features/delta-onboarding/redux/delta-onboarding-selectors'
import { setLastDisplayedVersion } from '../../features/release-notes/redux/release-notes-slice'
import { getDisplayVersion } from '../../features/release-notes/utils/get-display-version'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { getNotificationOnboardingShown } from '../../services/redux/selectors/onboarding-selectors'
import { modalCardStyle } from '../../theme/utils'
import { OnboardingNotificationPermissionRouteName } from './onboarding/onboarding-notification-permission-route'
import { ReleaseNotesModalScreen } from './release-notes-modal-screen'

export const ReleaseNotesModalRouteName = 'ReleaseNotesModal'

export type ReleaseNotesModalRouteParams = undefined

export type ReleaseNotesModalRouteStackParams = {
  ReleaseNotes: undefined
}

const ReleaseNotesModalRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()
  const notificationOnboardingShown = useSelector(getNotificationOnboardingShown)
  const deltaNotificationOnboardingShown = useSelector(getDeltaPushNotificationsOnboardingShown)
  const dispatch = useDispatch()

  const onPressOk = useCallback(() => {
    dispatch(setLastDisplayedVersion(getDisplayVersion()))
    if (!notificationOnboardingShown || !deltaNotificationOnboardingShown) {
      modalNavigation.navigate({ screen: OnboardingNotificationPermissionRouteName })
    } else {
      modalNavigation.goBack()
    }
  }, [dispatch, notificationOnboardingShown, modalNavigation, deltaNotificationOnboardingShown])

  return (
    <ReleaseNotesModalScreen
      testID="release_notes"
      acceptButtonI18nKey="release_notes_screen_button_ok_text"
      bodyTitleI18nKey="release_notes_screen_body_title"
      headerTitleI18nKey="release_notes_screen_headline_title"
      bodyTextGenericI18nKey="release_notes_screen_body_text_generic"
      bodyTextListBaseI18nKey="release_notes_screen_body_text_list_item"
      onPressOk={onPressOk}
    />
  )
}

export const ReleaseNotesModalRouteConfig = createRouteConfig({
  name: ReleaseNotesModalRouteName,
  component: ReleaseNotesModalRoute,
  options: { cardStyle: modalCardStyle },
})
