import React, { useCallback } from 'react'
import { useModalNavigation } from '../../navigation/modal/hooks'

import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../theme/utils'
import { DeveloperMenuScreen } from './developer-menu-screen'
import { EnvironmentConfigRouteConfig } from './environment-config-route'
import { SimulationCardConfigRouteConfig } from './simulation-card-config-route'
import { StorybookRouteConfig } from './storybook-route'
import { AppConfigRouteConfig } from './app-config-route'

export const DeveloperMenuRouteName = 'DeveloperMenu'

export type DeveloperMenuRouteParams = undefined

export const DeveloperMenuRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  const onHeaderPressClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  const onPressEnvironmentConfiguration = useCallback(() => {
    modalNavigation.navigate({
      screen: EnvironmentConfigRouteConfig.name,
    })
  }, [modalNavigation])

  const onPressAppConfig = useCallback(() => {
    modalNavigation.navigate({
      screen: AppConfigRouteConfig.name,
    })
  }, [modalNavigation])

  const onPressCardSimulationConfiguration = useCallback(() => {
    modalNavigation.navigate({
      screen: SimulationCardConfigRouteConfig.name,
    })
  }, [modalNavigation])

  const onPressStorybookConfiguration = useCallback(() => {
    modalNavigation.navigate({
      screen: StorybookRouteConfig.name,
    })
  }, [modalNavigation])

  return (
    <DeveloperMenuScreen
      onHeaderPressClose={onHeaderPressClose}
      onPressEnvironmentConfiguration={onPressEnvironmentConfiguration}
      onPressAppConfig={onPressAppConfig}
      onPressCardSimulationConfiguration={onPressCardSimulationConfiguration}
      onPressStorybookConfiguration={onPressStorybookConfiguration}
    />
  )
}

export const DeveloperMenuRouteConfig = createRouteConfig({
  name: DeveloperMenuRouteName,
  component: DeveloperMenuRoute,
  options: { cardStyle: modalCardStyle },
})
