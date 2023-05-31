import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { AppInformationsScreen } from './app-informations-screen'

export const AppInformationsRouteName = 'AppInformations'

export type AppInformationsRouteParams = undefined

export const AppInformationsRoute: React.FC = () => {
  const navigation = useNavigation()
  return <AppInformationsScreen onPressBackButton={navigation.goBack} />
}

export const AppInformationsRouteConfig = createRouteConfig({
  name: AppInformationsRouteName,
  component: AppInformationsRoute,
})
