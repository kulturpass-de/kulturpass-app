import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import { StatusBar } from 'react-native'
import { AccountDeletionConfirmRouteConfig } from '../../features/account-deletion/screens/account-deletion-confirm-route'
import { AccountDeletionSuccessfulRouteConfig } from '../../features/account-deletion/screens/account-deletion-successful-route'
import { EidAboutServiceProviderRouteConfig } from '../../features/eid-verification/screens/eid-about-service-provider-route'
import { EidAboutVerificationRouteConfig } from '../../features/eid-verification/screens/eid-about-verification-route'
import { EidCanRouteConfig } from '../../features/eid-verification/screens/eid-can-route'
import { EidChangePinCompletionRouteConfig } from '../../features/eid-verification/screens/eid-change-pin-completion-route'
import { EidInsertCardRouteConfig } from '../../features/eid-verification/screens/eid-insert-card-route'
import { EidNewPinRouteConfig } from '../../features/eid-verification/screens/eid-new-pin-route'
import { EidNFCNotSupportedRouteConfig } from '../../features/eid-verification/screens/eid-nfc-not-supported-route'
import { EidPinRouteConfig } from '../../features/eid-verification/screens/eid-pin-route'
import { EidPukInoperativeRouteConfig } from '../../features/eid-verification/screens/eid-puk-inoperative-route'
import { EidPukRouteConfig } from '../../features/eid-verification/screens/eid-puk-route'
import { EidServiceProviderDetailsRouteConfig } from '../../features/eid-verification/screens/eid-service-provider-details-route'
import { EidTransportPinRouteConfig } from '../../features/eid-verification/screens/eid-transport-pin-route'
import { EidVerificationCompletionRouteConfig } from '../../features/eid-verification/screens/eid-verification-completion-route'
import { ForceUpdateRouteConfig } from '../../features/force-update/screens/force-update-route'
import { OfferSelectionRouteConfig } from '../../features/product-detail/screens/offer-selection-route'
import { ProductConfirmReservationRouteConfig } from '../../features/product-detail/screens/product-confirm-reservation-route'
import { ProductDetailRouteConfig } from '../../features/product-detail/screens/product-detail-route'
import { ReservationDetailRouteConfig } from '../../features/reservations/screens/reservation-detail-route'
import { AppConfigRouteConfig } from '../../screens/developer-settings/app-config-route'
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
      <StatusBar backgroundColor="#00000000" translucent barStyle={'dark-content'} />

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

        {/* Account Deletion Routes */}
        <Stack.Screen {...AccountDeletionConfirmRouteConfig} />
        <Stack.Screen {...AccountDeletionSuccessfulRouteConfig} />

        {/* Product Detail Routes */}
        <Stack.Screen {...ProductDetailRouteConfig} />
        <Stack.Screen {...OfferSelectionRouteConfig} />
        <Stack.Screen {...ProductConfirmReservationRouteConfig} />

        {/* eID Verification */}
        <Stack.Group screenOptions={{ gestureEnabled: false, detachPreviousScreen: true }}>
          <Stack.Screen {...EidAboutVerificationRouteConfig} />
          <Stack.Screen {...EidAboutServiceProviderRouteConfig} />
          <Stack.Screen {...EidInsertCardRouteConfig} />
          <Stack.Screen {...EidPinRouteConfig} />
          <Stack.Screen {...EidCanRouteConfig} />
          <Stack.Screen {...EidPukRouteConfig} />
          <Stack.Screen {...EidTransportPinRouteConfig} />
          <Stack.Screen {...EidNewPinRouteConfig} />
          <Stack.Screen {...EidVerificationCompletionRouteConfig} />
          <Stack.Screen {...EidChangePinCompletionRouteConfig} />
          <Stack.Screen {...EidNFCNotSupportedRouteConfig} />
          <Stack.Screen {...EidPukInoperativeRouteConfig} />
        </Stack.Group>
        <Stack.Screen {...EidServiceProviderDetailsRouteConfig} />

        {/* Reservation Detail Routes */}
        <Stack.Screen {...ReservationDetailRouteConfig} />

        {/* Developer Settings Routes */}
        <Stack.Screen {...DeveloperMenuRouteConfig} />
        <Stack.Screen {...EnvironmentConfigRouteConfig} />
        <Stack.Screen {...AppConfigRouteConfig} />
        <Stack.Screen {...SimulationCardConfigRouteConfig} />
        <Stack.Screen {...StorybookRouteConfig} />
      </Stack.Navigator>
    </ModalStackWrapper>
  )
}
