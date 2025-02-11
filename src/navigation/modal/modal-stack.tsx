import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import { StatusBar } from 'react-native'
import { BudgetVoucherRouteConfig } from '../../features/budget-voucher/screens/budget-voucher-route'
import { EditorialEmailConsentModalRouteConfig } from '../../features/delta-onboarding/screens/editorial-email-consent-modal-route'
import { MobilityOffersErrorPageRouteConfig } from '../../features/mobility-offers/screens/mobility-offers-error-page-route'
import { MobilityOffersProductDetailsRouteConfig } from '../../features/mobility-offers/screens/mobility-offers-product-details-route'
import { MobilityOffersRouteConfig } from '../../features/mobility-offers/screens/mobility-offers-route'
import { AccountDeletionConfirmRouteConfig } from '../../screens/account/delete-account/account-deletion-confirm-route'
import { AccountDeletionSuccessfulRouteConfig } from '../../screens/account/delete-account/account-deletion-successful-route'
import { ForgotPasswordRouteConfig } from '../../screens/account/forgot-password/forgot-password-route'
import { LocationSharingRouteConfig } from '../../screens/account/preferences/location-sharing-route'
import { RegistrationConsentRouteConfig } from '../../screens/account/registration/registration-consent-route'
import { RegistrationDataPrivacyRouteConfig } from '../../screens/account/registration/registration-data-privacy-route'
import { RegistrationFinishedRouteConfig } from '../../screens/account/registration/registration-finished-route'
import { RegistrationFormRouteConfig } from '../../screens/account/registration/registration-form-route'
import { RegistrationPreferencesRouteConfig } from '../../screens/account/registration/registration-preferences-route'
import { RegistrationSuccessRouteConfig } from '../../screens/account/registration/registration-success-route'
import { AppConfigRouteConfig } from '../../screens/app/developer-settings/app-config-route'
import { DarkModePreviewRouteConfig } from '../../screens/app/developer-settings/dark-mode-preview-route'
import { DeveloperMenuRouteConfig } from '../../screens/app/developer-settings/developer-menu-route'
import { EnvironmentConfigRouteConfig } from '../../screens/app/developer-settings/environment-config-route'
import { NotificationsRouteConfig } from '../../screens/app/developer-settings/notifications-route'
import { SimulationCardConfigRouteConfig } from '../../screens/app/developer-settings/simulation-card-config-route'
import { StorybookRouteConfig } from '../../screens/app/developer-settings/storybook-route'
import { ForceUpdateRouteConfig } from '../../screens/app/force-update-route'
import { OnboardingNotificationPermissionRouteConfig } from '../../screens/app/onboarding/onboarding-notification-permission-route'
import { ReleaseNotesModalRouteConfig } from '../../screens/app/release-notes-modal-route'
import { LogInRouteConfig } from '../../screens/auth/log-in-route'
import { LogOutRouteConfig } from '../../screens/auth/log-out-route'
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
        <Stack.Screen {...NotificationsRouteConfig} />
        <Stack.Screen {...SimulationCardConfigRouteConfig} />
        <Stack.Screen {...StorybookRouteConfig} />
        <Stack.Screen {...DarkModePreviewRouteConfig} />

        <Stack.Screen {...ReleaseNotesModalRouteConfig} />

        <Stack.Screen {...EditorialEmailConsentModalRouteConfig} />

        <Stack.Screen {...LocationSharingRouteConfig} />

        <Stack.Screen {...OnboardingNotificationPermissionRouteConfig} />

        <Stack.Screen {...BudgetVoucherRouteConfig} />

        <Stack.Screen {...MobilityOffersProductDetailsRouteConfig} />
        <Stack.Screen {...MobilityOffersRouteConfig} />
        <Stack.Screen {...MobilityOffersErrorPageRouteConfig} />
      </Stack.Navigator>
    </ModalStackWrapper>
  )
}
