import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import { EditorialEmailConsentScreenRouteConfig } from '../../../features/delta-onboarding/screens/editorial-email-consent-screen-route'
import { DeleteAccountRouteConfig } from '../../../screens/account/delete-account/delete-account-route'
import { ChangeLanguageRouteConfig } from '../../../screens/account/preferences/change-language-route'
import { PreferencesRouteConfig } from '../../../screens/account/preferences/preferences-route'
import { UpdateProfileRouteConfig } from '../../../screens/account/profile/update-profile-route'
import { ViewProfileRouteConfig } from '../../../screens/account/profile/view-profile-route'
import { AppInformationsRouteConfig } from '../../../screens/app/app-informations-route'
import { ContactRouteConfig } from '../../../screens/app/contact-route'
import { ReleaseNotesRouteConfig } from '../../../screens/app/release-notes-route'
import { SettingsParamList } from './types'

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
      <Stack.Screen {...ReleaseNotesRouteConfig} />
      <Stack.Screen {...PreferencesRouteConfig} />
      <Stack.Screen {...UpdateProfileRouteConfig} />
      <Stack.Screen {...ContactRouteConfig} />
      <Stack.Screen {...AppInformationsRouteConfig} />
      <Stack.Screen {...DeleteAccountRouteConfig} />
      <Stack.Screen {...EditorialEmailConsentScreenRouteConfig} />
    </Stack.Navigator>
  )
}
