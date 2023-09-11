import React from 'react'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
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
