import React from 'react'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

import { ChangeLanguageRouteConfig } from '../../../screens/settings-tab/change-language-route'
import { ViewProfileRouteConfig } from '../../../screens/settings-tab/view-profile-route'
import { PreferencesRouteConfig } from '../../../screens/settings-tab/preferences-route'
import { AppInformationsRouteConfig } from '../../../screens/settings-tab/app-informations-route'
import { SettingsParamList } from './types'
import { DeleteAccountRouteConfig } from '../../../screens/settings-tab/delete-account-route'
import { UpdateProfileRouteConfig } from '../../../screens/update-profile/update-profile-route'

const Stack = createStackNavigator<SettingsParamList>()

export const SettingsStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, ...TransitionPresets.SlideFromRightIOS }}>
      <Stack.Screen {...ViewProfileRouteConfig} />
      <Stack.Screen {...ChangeLanguageRouteConfig} />
      <Stack.Screen {...PreferencesRouteConfig} />
      <Stack.Screen {...UpdateProfileRouteConfig} />
      <Stack.Screen {...AppInformationsRouteConfig} />
      <Stack.Screen {...DeleteAccountRouteConfig} />
    </Stack.Navigator>
  )
}
