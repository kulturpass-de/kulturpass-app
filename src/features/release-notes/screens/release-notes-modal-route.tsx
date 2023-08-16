import { NavigatorScreenParams } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { setLastDisplayedVersion } from '../redux/release-notes-slice'
import { getDisplayVersion } from '../utils/getDisplayVersion'
import { ReleaseNotesModalScreen } from './release-notes-modal-screen'

export const ReleaseNotesModalRouteName = 'ReleaseNotesModal'

export type ReleaseNotesModalRouteParams = undefined

export type ReleaseNotesModalRouteStackParams = {
  ReleaseNotes: NavigatorScreenParams<ReleaseNotesModalRouteParams>
}

const ReleaseNotesModalRoute: React.FC = () => {
  const navigation = useModalNavigation()
  const dispatch = useDispatch()

  const onPressOk = useCallback(() => {
    dispatch(setLastDisplayedVersion(getDisplayVersion()))
    navigation.goBack()
  }, [navigation, dispatch])

  return (
    <ReleaseNotesModalScreen
      testID="release_notes"
      acceptButtonI18nKey="release_notes_screen_button_ok_text"
      bodyTitleI18nKey="release_notes_screen_body_title"
      headerTitleI18nKey="release_notes_screen_headline_title"
      bodyTextGenericI18nKey="release_notes_screen_body_text_generic"
      bodyTextListI18nKey="release_notes_screen_body_text_list"
      onPressOk={onPressOk}
    />
  )
}

export const ReleaseNotesModalRouteConfig = createRouteConfig({
  name: ReleaseNotesModalRouteName,
  component: ReleaseNotesModalRoute,
  options: { cardStyle: modalCardStyle },
})