import React, { useCallback } from 'react'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { useTabsNavigation } from '../../navigation/tabs/hooks'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../theme/utils'
import { StorybookScreen } from './storybook-screen'

export const StorybookRouteName = 'Storybook'

export type StorybookRouteParams = undefined

export const StorybookRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()
  const tabsNavigation = useTabsNavigation()

  const onHeaderPressBack = useCallback(() => {
    modalNavigation.goBack()
  }, [modalNavigation])

  const onHeaderPressClose = useCallback(() => {
    tabsNavigation.navigate('Settings', {
      screen: 'ViewProfile',
    })
  }, [tabsNavigation])

  return <StorybookScreen onHeaderPressBack={onHeaderPressBack} onHeaderPressClose={onHeaderPressClose} />
}

export const StorybookRouteConfig = createRouteConfig({
  name: StorybookRouteName,
  component: StorybookRoute,
  options: { cardStyle: modalCardStyle },
})
