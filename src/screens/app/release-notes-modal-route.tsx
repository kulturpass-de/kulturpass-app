import { NavigatorScreenParams } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getNotificationOnboardingShown } from '../../features/onboarding/redux/onboarding-selectors'
import { setLastDisplayedVersion } from '../../features/release-notes/redux/release-notes-slice'
import { getDisplayVersion } from '../../features/release-notes/utils/get-display-version'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../theme/utils'
import { OnboardingNotificationPermissionRouteName } from './onboarding/onboarding-notification-permission-route'
import { ReleaseNotesModalScreen } from './release-notes-modal-screen'

export const ReleaseNotesModalRouteName = 'ReleaseNotesModal'

export type ReleaseNotesModalRouteParams = undefined

export type ReleaseNotesModalRouteStackParams = {
  ReleaseNotes: NavigatorScreenParams<ReleaseNotesModalRouteParams>
}

const ReleaseNotesModalRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()
  const notificationOnboardingShown = useSelector(getNotificationOnboardingShown)
  const dispatch = useDispatch()

  const onPressOk = useCallback(() => {
    dispatch(setLastDisplayedVersion(getDisplayVersion()))
    if (!notificationOnboardingShown) {
      modalNavigation.navigate({ screen: OnboardingNotificationPermissionRouteName })
    } else {
      modalNavigation.goBack()
    }
  }, [dispatch, notificationOnboardingShown, modalNavigation])

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
