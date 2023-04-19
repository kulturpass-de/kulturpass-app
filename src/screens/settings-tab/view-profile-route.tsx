import React, { useCallback } from 'react'

import { useModalNavigation } from '../../navigation/modal/hooks'
import { useTabsNavigation } from '../../navigation/tabs/hooks'
import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { ViewProfileScreen } from './view-profile-screen'
import { env } from '../../env'
import { useAuth } from '../../services/auth/use-auth'

export const ViewProfileRouteName = 'ViewProfile'

export type ViewProfileRouteParams = undefined

export const ViewProfileRoute: React.FC = () => {
  const tabsNavigation = useTabsNavigation()
  const modalnavigation = useModalNavigation()
  const auth = useAuth()

  const onPressChangeLanguage = useCallback(() => {
    tabsNavigation.navigate('Settings', { screen: 'ChangeLanguage' })
  }, [tabsNavigation])

  const onPressEditPreferences = useCallback(() => {
    tabsNavigation.navigate('Settings', { screen: 'Preferences' })
  }, [tabsNavigation])

  const onPressAppInformations = useCallback(() => {
    tabsNavigation.navigate('Settings', { screen: 'AppInformations' })
  }, [tabsNavigation])

  const onPressDeveloperMenu = useCallback(() => {
    if (env.DEV_MENU) {
      modalnavigation.navigate({ screen: 'DeveloperMenu' })
    }
  }, [modalnavigation])

  const onPressLogin = useCallback(() => {
    modalnavigation.navigate({
      screen: 'LogIn',
    })
  }, [modalnavigation])

  const onPressLogout = useCallback(() => {
    auth.logout()
  }, [auth])

  return (
    <ViewProfileScreen
      onPressChangeLanguage={onPressChangeLanguage}
      onPressEditPreferences={onPressEditPreferences}
      onPressAppInformations={onPressAppInformations}
      onPressDeveloperMenu={onPressDeveloperMenu}
      onPressLogin={onPressLogin}
      onPressLogout={onPressLogout}
    />
  )
}

export const ViewProfileRouteConfig = createRouteConfig({
  name: ViewProfileRouteName,
  component: ViewProfileRoute,
})
