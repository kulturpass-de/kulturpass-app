import React from 'react'

import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { HomeScreen } from './home-screen'

export const HomeRouteName = 'Home'

export type HomeRouteParams = undefined

export const HomeRoute: React.FC = () => {
  return <HomeScreen />
}

export const HomeRouteConfig = createRouteConfig({
  name: HomeRouteName,
  component: HomeRoute,
})
