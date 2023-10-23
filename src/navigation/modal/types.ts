import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import {
  AccountDeletionConfirmRouteName,
  AccountDeletionConfirmRouteParams,
} from '../../features/account-deletion/screens/account-deletion-confirm-route'
import {
  AccountDeletionSuccessfulRouteName,
  AccountDeletionSuccessfulRouteParams,
} from '../../features/account-deletion/screens/account-deletion-successful-route'
import { ForceUpdateRouteName, ForceUpdateRouteParams } from '../../features/force-update/screens/force-update-route'
import {
  OfferSelectionRouteName,
  OfferSelectionRouteParams,
} from '../../features/product-detail/screens/offer-selection-route'
import {
  ProductConfirmReservationRouteName,
  ProductConfirmReservationRouteParams,
} from '../../features/product-detail/screens/product-confirm-reservation-route'
import {
  ProductDetailRouteName,
  ProductDetailRouteParams,
} from '../../features/product-detail/screens/product-detail-route'
import {
  ReservationDetailRouteName,
  ReservationDetailRouteParams,
} from '../../features/reservations/screens/reservation-detail-route'
import { AppConfigRouteName, AppConfigRouteParams } from '../../screens/developer-settings/app-config-route'
import {
  DarkModePreviewRouteName,
  DarkModePreviewRouteParams,
} from '../../screens/developer-settings/dark-mode-preview-route'
import { DeveloperMenuRouteName, DeveloperMenuRouteParams } from '../../screens/developer-settings/developer-menu-route'
import {
  EnvironmentConfigRouteName,
  EnvironmentConfigRouteParams,
} from '../../screens/developer-settings/environment-config-route'
import {
  SimulationCardConfigRouteName,
  SimulationCardConfigRouteParams,
} from '../../screens/developer-settings/simulation-card-config-route'
import { StorybookRouteName, StorybookRouteParams } from '../../screens/developer-settings/storybook-route'
import { LogInRouteName, LogInRouteParams } from '../../screens/log-in/log-in-route'
import { LogOutRouteName, LogOutRouteParams } from '../../screens/log-out/log-out-route'
import {
  RegistrationPreferencesRouteParams,
  RegistrationPreferencesRouteName,
} from '../../screens/registration-preferences/registration-preferences-route'
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
  RegistrationFormRouteName,
  RegistrationFormRouteParams,
} from '../../screens/registration/registration-form-route'
import { RootStackParams, RootStackScreenProps } from '../types'
import {
  ForgotPasswordRouteName,
  ForgotPasswordRouteParams,
} from './../../screens/forgot-password/forgot-password-route'

export type ModalParamList = {
  [LogOutRouteName]: LogOutRouteParams
  [LogInRouteName]: LogInRouteParams
  [ForgotPasswordRouteName]: ForgotPasswordRouteParams

  [ForceUpdateRouteName]: ForceUpdateRouteParams

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

  [ReservationDetailRouteName]: ReservationDetailRouteParams

  [DeveloperMenuRouteName]: DeveloperMenuRouteParams
  [EnvironmentConfigRouteName]: EnvironmentConfigRouteParams
  [AppConfigRouteName]: AppConfigRouteParams
  [SimulationCardConfigRouteName]: SimulationCardConfigRouteParams
  [StorybookRouteName]: StorybookRouteParams
  [DarkModePreviewRouteName]: DarkModePreviewRouteParams
}

export type ModalScreenProps<RouteName extends keyof ModalParamList> = CompositeScreenProps<
  StackScreenProps<ModalParamList, RouteName>,
  RootStackScreenProps<keyof RootStackParams>
>
