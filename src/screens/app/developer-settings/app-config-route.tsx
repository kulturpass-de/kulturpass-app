import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { AppConfigScreen } from './app-config-screen'

export const AppConfigRouteName = 'AppConfig'

export type AppConfigRouteParams = undefined

export const AppConfigRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  const onHeaderPressBack = useCallback(() => {
    modalNavigation.goBack()
  }, [modalNavigation])

  const onHeaderPressClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  return <AppConfigScreen onHeaderPressBack={onHeaderPressBack} onHeaderPressClose={onHeaderPressClose} />
}

export const AppConfigRouteConfig = createRouteConfig({
  name: AppConfigRouteName,
  component: AppConfigRoute,
  options: { cardStyle: modalCardStyle },
})
