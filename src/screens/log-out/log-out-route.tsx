import React, { useCallback } from 'react'

import { useTabsNavigation } from '../../navigation/tabs/hooks'
import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../theme/utils'
import { HomeRouteConfig } from '../home/home-route'
import { LogOutScreen } from './log-out-screen'

export const LogOutRouteName = 'LogOut'

export type LogOutRouteParams = undefined

export const LogOutRoute: React.FC = () => {
  const appTabsNavigation = useTabsNavigation()

  const onPressOkButton = useCallback(() => {
    appTabsNavigation.navigate(HomeRouteConfig.name)
  }, [appTabsNavigation])

  return <LogOutScreen onPressOkButton={onPressOkButton} />
}

export const LogOutRouteConfig = createRouteConfig({
  name: LogOutRouteName,
  component: LogOutRoute,
  options: { cardStyle: modalCardStyle },
})
