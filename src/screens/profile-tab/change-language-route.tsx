import React, { useCallback } from 'react'
import { useTabsNavigation } from '../../navigation/tabs/hooks'
import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { ChangeLanguageScreen } from './change-language-screen'

export const ChangeLanguageRouteName = 'ChangeLanguage'

export type ChangeLanguageRouteParams = undefined

export const ChangeLanguageRoute: React.FC = () => {
  const tabsNavigation = useTabsNavigation()

  const onHeaderPressClose = useCallback(() => {
    tabsNavigation.goBack()
  }, [tabsNavigation])

  return <ChangeLanguageScreen onHeaderPressClose={onHeaderPressClose} />
}

export const ChangeLanguageRouteConfig = createRouteConfig({
  name: ChangeLanguageRouteName,
  component: ChangeLanguageRoute,
})
