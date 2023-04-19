import React, { useCallback } from 'react'

import { useModalNavigation } from '../../navigation/modal/hooks'
import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../theme/utils'
import { EnvironmentConfigScreen } from './environment-config-screen'

export const EnvironmentConfigRouteName = 'EnvironmentConfig'

export type EnvironmentConfigRouteParams = undefined

export const EnvironmentConfigRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  const onHeaderPressBack = useCallback(() => {
    modalNavigation.goBack()
  }, [modalNavigation])

  const onHeaderPressClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  return <EnvironmentConfigScreen onHeaderPressBack={onHeaderPressBack} onHeaderPressClose={onHeaderPressClose} />
}

export const EnvironmentConfigRouteConfig = createRouteConfig({
  name: EnvironmentConfigRouteName,
  component: EnvironmentConfigRoute,
  options: { cardStyle: modalCardStyle },
})
