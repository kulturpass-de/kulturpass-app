import React, { useCallback } from 'react'
import { EditorialEmailConsentScreenRouteName } from '../../../features/delta-onboarding/screens/editorial-email-consent-screen-route'
import { useTabsNavigation } from '../../../navigation/tabs/hooks'
import { SettingsScreenProps } from '../../../navigation/tabs/settings/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { useUserInfo } from '../../../services/user/use-user-info'
import { PreferencesScreen } from './preferences-screen'

export const PreferencesRouteName = 'Preferences'

export type PreferencesRouteParams = undefined

export type PreferencesRouteProps = SettingsScreenProps<'Preferences'>

export const PreferencesRoute: React.FC<PreferencesRouteProps> = () => {
  const tabsNavigation = useTabsNavigation()
  useUserInfo()

  const navigateBack = useCallback(() => {
    tabsNavigation.goBack()
  }, [tabsNavigation])

  const afterSubmitTriggered = useCallback(() => {
    navigateBack()
  }, [navigateBack])

  const onPressClose = useCallback(() => {
    navigateBack()
  }, [navigateBack])

  const onPressEmailInfo = useCallback(() => {
    tabsNavigation.navigate('Settings', { screen: EditorialEmailConsentScreenRouteName })
  }, [tabsNavigation])

  return (
    <PreferencesScreen
      afterSubmitTriggered={afterSubmitTriggered}
      onPressClose={onPressClose}
      onPressEmailInfo={onPressEmailInfo}
    />
  )
}

export const PreferencesRouteConfig = createRouteConfig({
  name: PreferencesRouteName,
  component: PreferencesRoute,
})
