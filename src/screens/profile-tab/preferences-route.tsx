import React, { useCallback } from 'react'
import { useTabsNavigation } from '../../navigation/tabs/hooks'
import { SettingsScreenProps } from '../../navigation/tabs/settings/types'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { PreferencesScreen } from './preferences-screen'

export const PreferencesRouteName = 'Preferences'

export type PreferencesRouteParams = undefined

export type PreferencesRouteProps = SettingsScreenProps<'Preferences'>

export const PreferencesRoute: React.FC<PreferencesRouteProps> = () => {
  const tabsNavigation = useTabsNavigation()

  const navigateBack = useCallback(() => {
    tabsNavigation.goBack()
  }, [tabsNavigation])

  const afterSubmitTriggered = useCallback(() => {
    navigateBack()
  }, [navigateBack])

  const onPressClose = useCallback(() => {
    navigateBack()
  }, [navigateBack])

  return <PreferencesScreen afterSubmitTriggered={afterSubmitTriggered} onPressClose={onPressClose} />
}

export const PreferencesRouteConfig = createRouteConfig({
  name: PreferencesRouteName,
  component: PreferencesRoute,
})
