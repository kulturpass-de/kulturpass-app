import {
  ForgotPasswordRouteName,
  ForgotPasswordRouteParams,
} from './../../screens/forgot-password/forgot-password-route'
import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { LogInRouteName, LogInRouteParams } from '../../screens/log-in/log-in-route'
import { LogOutRouteName, LogOutRouteParams } from '../../screens/log-out/log-out-route'
import {
  RegistrationFormRouteName,
  RegistrationFormRouteParams,
} from '../../screens/registration/registration-form-route'
import { DeveloperMenuRouteName, DeveloperMenuRouteParams } from '../../screens/developer-settings/developer-menu-route'
import {
  EnvironmentConfigRouteName,
  EnvironmentConfigRouteParams,
} from '../../screens/developer-settings/environment-config-route'
import { StorybookRouteName, StorybookRouteParams } from '../../screens/developer-settings/storybook-route'
import {
  OnboardingAboutAppRouteName,
  OnboardingAboutAppRouteParams,
} from '../../features/onboarding/screens/onboarding-about-app-route'
import {
  OnboardingLocationPermissionRouteName,
  OnboardingLocationPermissionRouteParams,
} from '../../features/onboarding/screens/onboarding-location-permission-route'
import { RootStackParams, RootStackScreenProps } from '../types'
import {
  ProductDetailRouteName,
  ProductDetailRouteParams,
} from '../../features/product-detail/screens/product-detail-route'
import {
  RegistrationPreferencesRouteParams,
  RegistrationPreferencesRouteName,
} from '../../screens/registration-preferences/registration-preferences-route'
import {
  OfferSelectionRouteName,
  OfferSelectionRouteParams,
} from '../../features/product-detail/screens/offer-selection-route'
import {
  RegistrationSuccessRouteName,
  RegistrationSuccessRouteParams,
} from '../../screens/registration-success/registration-success-route'
import {
  RegistrationConsentRouteName,
  RegistrationConsentRouteParams,
} from '../../screens/registration/registration-consent-route'
import {
  RegistrationDataPrivacyRouteName,
  RegistrationDataPrivacyRouteParams,
} from '../../screens/registration/registration-data-privacy-route'
import {
  EidAboutVerificationRouteName,
  EidAboutVerificationRouteParams,
} from '../../features/eid-verification/screens/eid-about-verification-route'
import {
  EidAboutServiceProviderRouteName,
  EidAboutServiceProviderRouteParams,
} from '../../features/eid-verification/screens/eid-about-service-provider-route'
import {
  EidInsertCardRouteName,
  EidInsertCardRouteParams,
} from '../../features/eid-verification/screens/eid-insert-card-route'
import { EidPinRouteName, EidPinRouteParams } from '../../features/eid-verification/screens/eid-pin-route'
import {
  EidVerificationCompletionRouteName,
  EidVerificationCompletionRouteParams,
} from '../../features/eid-verification/screens/eid-verification-completion-route'
import { EidCanRouteName, EidCanRouteParams } from '../../features/eid-verification/screens/eid-can-route'
import {
  ReservationDetailRouteName,
  ReservationDetailRouteParams,
} from '../../features/reservations/screens/reservation-detail-route'
import {
  ProductConfirmReservationRouteName,
  ProductConfirmReservationRouteParams,
} from '../../features/product-detail/screens/product-confirm-reservation-route'
import {
  SimulationCardConfigRouteName,
  SimulationCardConfigRouteParams,
} from '../../screens/developer-settings/simulation-card-config-route'
import {
  EidTransportPinRouteName,
  EidTransportPinRouteParams,
} from '../../features/eid-verification/screens/eid-transport-pin-route'
import { EidNewPinRouteName, EidNewPinRouteParams } from '../../features/eid-verification/screens/eid-new-pin-route'
import {
  EidChangePinCompletionRouteName,
  EidChangePinCompletionRouteParams,
} from '../../features/eid-verification/screens/eid-change-pin-completion-route'
import {
  EidServiceProviderDetailsRouteName,
  EidServiceProviderDetailsRouteParams,
} from '../../features/eid-verification/screens/eid-service-provider-details-route'
import {
  EidNFCNotSupportedRouteName,
  EidNFCNotSupportedRouteParams,
} from '../../features/eid-verification/screens/eid-nfc-not-supported-route'
import {
  AccountDeletionConfirmRouteName,
  AccountDeletionConfirmRouteParams,
} from '../../features/account-deletion/screens/account-deletion-confirm-route'
import {
  AccountDeletionSuccessfulRouteName,
  AccountDeletionSuccessfulRouteParams,
} from '../../features/account-deletion/screens/account-deletion-successful-route'
import { ForceUpdateRouteName, ForceUpdateRouteParams } from '../../features/force-update/screens/force-update-route'
import { AppConfigRouteName, AppConfigRouteParams } from '../../screens/developer-settings/app-config-route'
import { EidPukRouteName, EidPukRouteParams } from '../../features/eid-verification/screens/eid-puk-route'
import {
  EidPukInoperativeRouteName,
  EidPukInoperativeRouteParams,
} from '../../features/eid-verification/screens/eid-puk-inoperative-route'

export type ModalParamList = {
  [LogOutRouteName]: LogOutRouteParams
  [LogInRouteName]: LogInRouteParams
  [ForgotPasswordRouteName]: ForgotPasswordRouteParams

  [ForceUpdateRouteName]: ForceUpdateRouteParams

  [OnboardingAboutAppRouteName]: OnboardingAboutAppRouteParams
  [OnboardingLocationPermissionRouteName]: OnboardingLocationPermissionRouteParams

  [RegistrationConsentRouteName]: RegistrationConsentRouteParams
  [RegistrationDataPrivacyRouteName]: RegistrationDataPrivacyRouteParams
  [RegistrationFormRouteName]: RegistrationFormRouteParams
  [RegistrationSuccessRouteName]: RegistrationSuccessRouteParams
  [RegistrationPreferencesRouteName]: RegistrationPreferencesRouteParams

  [AccountDeletionConfirmRouteName]: AccountDeletionConfirmRouteParams
  [AccountDeletionSuccessfulRouteName]: AccountDeletionSuccessfulRouteParams

  [ProductDetailRouteName]: ProductDetailRouteParams
  [OfferSelectionRouteName]: OfferSelectionRouteParams
  [ProductConfirmReservationRouteName]: ProductConfirmReservationRouteParams

  [EidAboutVerificationRouteName]: EidAboutVerificationRouteParams
  [EidAboutServiceProviderRouteName]: EidAboutServiceProviderRouteParams
  [EidServiceProviderDetailsRouteName]: EidServiceProviderDetailsRouteParams
  [EidInsertCardRouteName]: EidInsertCardRouteParams
  [EidPinRouteName]: EidPinRouteParams
  [EidTransportPinRouteName]: EidTransportPinRouteParams
  [EidNewPinRouteName]: EidNewPinRouteParams
  [EidCanRouteName]: EidCanRouteParams
  [EidPukRouteName]: EidPukRouteParams
  [EidVerificationCompletionRouteName]: EidVerificationCompletionRouteParams
  [EidChangePinCompletionRouteName]: EidChangePinCompletionRouteParams
  [EidNFCNotSupportedRouteName]: EidNFCNotSupportedRouteParams
  [EidPukInoperativeRouteName]: EidPukInoperativeRouteParams

  [ReservationDetailRouteName]: ReservationDetailRouteParams

  [DeveloperMenuRouteName]: DeveloperMenuRouteParams
  [EnvironmentConfigRouteName]: EnvironmentConfigRouteParams
  [AppConfigRouteName]: AppConfigRouteParams
  [SimulationCardConfigRouteName]: SimulationCardConfigRouteParams
  [StorybookRouteName]: StorybookRouteParams
}

export type ModalScreenProps<RouteName extends keyof ModalParamList> = CompositeScreenProps<
  StackScreenProps<ModalParamList, RouteName>,
  RootStackScreenProps<keyof RootStackParams>
>
