import { NavigatorScreenParams } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { useTabsNavigation } from '../../navigation/tabs/hooks'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../theme/utils'
import { ReleaseNotesScreen } from './release-notes-screen'

export const ReleaseNotesRouteName = 'ReleaseNotesScreen'

export type ReleaseNotesRouteParams = undefined

export type ReleaseNotesRouteStackParams = {
  ReleaseNotes: NavigatorScreenParams<ReleaseNotesRouteParams>
}

const ReleaseNotesRoute: React.FC = () => {
  const tabsNavigation = useTabsNavigation()

  const onPressOk = useCallback(() => {
    tabsNavigation.goBack()
  }, [tabsNavigation])

  return (
    <ReleaseNotesScreen
      testID="release_notes"
      bodyTitleI18nKey="release_notes_screen_body_title"
      headerTitleI18nKey="release_notes_screen_headline_title"
      bodyTextGenericI18nKey="release_notes_screen_body_text_generic"
      bodyTextListBaseI18nKey="release_notes_screen_body_text_list_item"
      onPressOk={onPressOk}
    />
  )
}

export const ReleaseNotesRouteConfig = createRouteConfig({
  name: ReleaseNotesRouteName,
  component: ReleaseNotesRoute,
  options: { cardStyle: modalCardStyle },
})
