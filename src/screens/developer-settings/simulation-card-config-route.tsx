import React, { useCallback } from 'react'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../theme/utils'
import { SimulationCardConfigScreen } from './simulation-card-config-screen'

export const SimulationCardConfigRouteName = 'SimulationCardConfig'

export type SimulationCardConfigRouteParams = undefined

export const SimulationCardConfigRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  const onHeaderPressBack = useCallback(() => {
    modalNavigation.goBack()
  }, [modalNavigation])

  const onHeaderPressClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  return <SimulationCardConfigScreen onHeaderPressBack={onHeaderPressBack} onHeaderPressClose={onHeaderPressClose} />
}

export const SimulationCardConfigRouteConfig = createRouteConfig({
  name: SimulationCardConfigRouteName,
  component: SimulationCardConfigRoute,
  options: { cardStyle: modalCardStyle },
})
