import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { FavoritesRouteConfig } from '../../screens/favorites/favorites-route'
import { HomeRouteConfig } from '../../screens/home/home-route'
import { ReservationsRouteConfig } from '../../screens/reservations/reservations-route'
import { SearchRouteConfig } from '../../screens/search/search-route'
import { SettingsStack } from './settings/settings-stack'
import { TabsParamList } from './types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomTabBar } from './bottom-tab-bar'

const BottomTab = createBottomTabNavigator<TabsParamList>()

export const Tabs: React.FC = () => {
  const { bottom } = useSafeAreaInsets()

  const screenOptions = {
    headerShown: false,
  }

  return (
    <BottomTab.Navigator
      // eslint-disable-next-line react/jsx-no-bind
      tabBar={props => <BottomTabBar {...props} bottomSafeArea={bottom} />}
      screenOptions={screenOptions}>
      <BottomTab.Screen name={HomeRouteConfig.name} component={HomeRouteConfig.component} />
      <BottomTab.Screen name={SearchRouteConfig.name} component={SearchRouteConfig.component} />
      <BottomTab.Screen name={ReservationsRouteConfig.name} component={ReservationsRouteConfig.component} />
      <BottomTab.Screen name={FavoritesRouteConfig.name} component={FavoritesRouteConfig.component} />
      <BottomTab.Screen name="Settings" component={SettingsStack} />
    </BottomTab.Navigator>
  )
}
