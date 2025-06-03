import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { AppConfigRouteConfig } from './app-config-route'
import { DarkModePreviewRouteConfig } from './dark-mode-preview-route'
import { DeveloperMenuScreen } from './developer-menu-screen'
import { EnvironmentConfigRouteConfig } from './environment-config-route'
import { NotificationsRouteConfig } from './notifications-route'
import { SimulationCardConfigRouteConfig } from './simulation-card-config-route'

export const DeveloperMenuRouteName = 'DeveloperMenu'

export type DeveloperMenuRouteParams = undefined

export const DeveloperMenuRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  const onHeaderPressClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  const onPressEnvironmentConfiguration = useCallback(() => {
    modalNavigation.navigate({ screen: EnvironmentConfigRouteConfig.name })
  }, [modalNavigation])

  const onPressAppConfig = useCallback(() => {
    modalNavigation.navigate({ screen: AppConfigRouteConfig.name })
  }, [modalNavigation])

  const onPressNotifications = useCallback(() => {
    modalNavigation.navigate({ screen: NotificationsRouteConfig.name })
  }, [modalNavigation])

  const onPressCardSimulationConfiguration = useCallback(() => {
    modalNavigation.navigate({ screen: SimulationCardConfigRouteConfig.name })
  }, [modalNavigation])

  const onPressDarkThemeConfiguration = useCallback(() => {
    modalNavigation.navigate({ screen: DarkModePreviewRouteConfig.name })
  }, [modalNavigation])

  return (
    <DeveloperMenuScreen
      onHeaderPressClose={onHeaderPressClose}
      onPressEnvironmentConfiguration={onPressEnvironmentConfiguration}
      onPressAppConfig={onPressAppConfig}
      onPressNotifications={onPressNotifications}
      onPressCardSimulationConfiguration={onPressCardSimulationConfiguration}
      onPressDarkThemeConfiguration={onPressDarkThemeConfiguration}
    />
  )
}

export const DeveloperMenuRouteConfig = createRouteConfig({
  name: DeveloperMenuRouteName,
  component: DeveloperMenuRoute,
  options: { cardStyle: modalCardStyle },
})
