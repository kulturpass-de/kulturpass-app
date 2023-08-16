import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import { StatusBar } from 'react-native'
import { AccountDeletionConfirmRouteConfig } from '../../features/account-deletion/screens/account-deletion-confirm-route'
import { AccountDeletionSuccessfulRouteConfig } from '../../features/account-deletion/screens/account-deletion-successful-route'
import { ForceUpdateRouteConfig } from '../../features/force-update/screens/force-update-route'
import { RegistrationFinishedRouteConfig } from '../../features/registration/screens/registration-finished-route'
import { ReleaseNotesModalRouteConfig } from '../../features/release-notes/screens/release-notes-modal-route'
import { AppConfigRouteConfig } from '../../screens/developer-settings/app-config-route'
import { DarkModePreviewRouteConfig } from '../../screens/developer-settings/dark-mode-preview-route'
import { DeveloperMenuRouteConfig } from '../../screens/developer-settings/developer-menu-route'
import { EnvironmentConfigRouteConfig } from '../../screens/developer-settings/environment-config-route'
import { SimulationCardConfigRouteConfig } from '../../screens/developer-settings/simulation-card-config-route'
import { StorybookRouteConfig } from '../../screens/developer-settings/storybook-route'
import { ForgotPasswordRouteConfig } from '../../screens/forgot-password/forgot-password-route'
import { LogInRouteConfig } from '../../screens/log-in/log-in-route'
import { LogOutRouteConfig } from '../../screens/log-out/log-out-route'
import { RegistrationPreferencesRouteConfig } from '../../screens/registration-preferences/registration-preferences-route'
import { RegistrationSuccessRouteConfig } from '../../screens/registration-success/registration-success-route'
import { RegistrationConsentRouteConfig } from '../../screens/registration/registration-consent-route'
import { RegistrationDataPrivacyRouteConfig } from '../../screens/registration/registration-data-privacy-route'
import { RegistrationFormRouteConfig } from '../../screens/registration/registration-form-route'
import { ModalStackWrapper } from './modal-stack-wrapper'
import { ModalParamList } from './types'

const Stack = createStackNavigator<ModalParamList>()

export const ModalStack: React.FC = () => {
  return (
    <ModalStackWrapper>
      {/* Note: Although #00000000 is just "transparent", together with `translucent` - it allows the modals of
      react-nativation to display their backdrop properly on Android */}
      <StatusBar backgroundColor="#00000000" translucent />

      <Stack.Navigator
        detachInactiveScreens
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        {/* Auth Routes */}
        <Stack.Screen {...LogOutRouteConfig} />
        <Stack.Screen {...LogInRouteConfig} />
        <Stack.Screen {...ForgotPasswordRouteConfig} />

        {/* Force Update Routes */}
        <Stack.Screen options={{ gestureEnabled: false }} {...ForceUpdateRouteConfig} />

        {/* Registration Routes */}
        <Stack.Screen {...RegistrationConsentRouteConfig} />
        <Stack.Screen {...RegistrationDataPrivacyRouteConfig} />
        <Stack.Screen {...RegistrationFormRouteConfig} />
        <Stack.Screen {...RegistrationSuccessRouteConfig} />
        <Stack.Screen {...RegistrationPreferencesRouteConfig} />
        <Stack.Screen {...RegistrationFinishedRouteConfig} />

        {/* Account Deletion Routes */}
        <Stack.Screen {...AccountDeletionConfirmRouteConfig} />
        <Stack.Screen {...AccountDeletionSuccessfulRouteConfig} />

        {/* Developer Settings Routes */}
        <Stack.Screen {...DeveloperMenuRouteConfig} />
        <Stack.Screen {...EnvironmentConfigRouteConfig} />
        <Stack.Screen {...AppConfigRouteConfig} />
        <Stack.Screen {...SimulationCardConfigRouteConfig} />
        <Stack.Screen {...StorybookRouteConfig} />
        <Stack.Screen {...DarkModePreviewRouteConfig} />

        <Stack.Screen {...ReleaseNotesModalRouteConfig} />
      </Stack.Navigator>
    </ModalStackWrapper>
  )
}
