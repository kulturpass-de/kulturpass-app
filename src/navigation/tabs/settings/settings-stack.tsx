import React from 'react'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

import { ChangeLanguageRouteConfig } from '../../../screens/profile-tab/change-language-route'
import { ViewProfileRouteConfig } from '../../../screens/profile-tab/view-profile-route'
import { PreferencesRouteConfig } from '../../../screens/profile-tab/preferences-route'
import { AppInformationsRouteConfig } from '../../../screens/profile-tab/app-informations-route'
import { SettingsParamList } from './types'
import { DeleteAccountRouteConfig } from '../../../screens/profile-tab/delete-account-route'
import { UpdateProfileRouteConfig } from '../../../screens/update-profile/update-profile-route'
import { ContactRouteConfig } from '../../../screens/profile-tab/contact-route'

const Stack = createStackNavigator<SettingsParamList>()

// note: changing this to another route may cause unexpected back-navigation behavior
export const SettingsStackInitialRouteName: keyof SettingsParamList = 'ViewProfile'

export const SettingsStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={SettingsStackInitialRouteName}
      screenOptions={{ headerShown: false, ...TransitionPresets.SlideFromRightIOS }}>
      <Stack.Screen {...ViewProfileRouteConfig} />
      <Stack.Screen {...ChangeLanguageRouteConfig} />
      <Stack.Screen {...PreferencesRouteConfig} />
      <Stack.Screen {...UpdateProfileRouteConfig} />
      <Stack.Screen {...ContactRouteConfig} />
      <Stack.Screen {...AppInformationsRouteConfig} />
      <Stack.Screen {...DeleteAccountRouteConfig} />
    </Stack.Navigator>
  )
}
