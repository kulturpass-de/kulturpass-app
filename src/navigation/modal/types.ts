import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import {
  BudgetVoucherRouteName,
  BudgetVoucherRouteParams,
} from '../../features/budget-voucher/screens/budget-voucher-route'
import {
  EditorialEmailConsentModalRouteName,
  EditorialEmailConsentModalRouteParams,
} from '../../features/delta-onboarding/screens/editorial-email-consent-modal-route'
import {
  MobilityOffersErrorPageRouteName,
  MobilityOffersErrorPageRouteParams,
} from '../../features/mobility-offers/screens/mobility-offers-error-page-route'
import {
  MobilityOffersProductDetailsRouteName,
  MobilityOffersProductDetailsRouteParams,
} from '../../features/mobility-offers/screens/mobility-offers-product-details-route'
import {
  MobilityOffersRouteName,
  MobilityOffersRouteParams,
} from '../../features/mobility-offers/screens/mobility-offers-route'
import {
  AccountDeletionConfirmRouteName,
  AccountDeletionConfirmRouteParams,
} from '../../screens/account/delete-account/account-deletion-confirm-route'
import {
  AccountDeletionSuccessfulRouteName,
  AccountDeletionSuccessfulRouteParams,
} from '../../screens/account/delete-account/account-deletion-successful-route'
import {
  ForgotPasswordRouteName,
  ForgotPasswordRouteParams,
} from '../../screens/account/forgot-password/forgot-password-route'
import {
  LocationSharingRouteName,
  LocationSharingRouteParams,
} from '../../screens/account/preferences/location-sharing-route'
import {
  RegistrationConsentRouteName,
  RegistrationConsentRouteParams,
} from '../../screens/account/registration/registration-consent-route'
import {
  RegistrationDataPrivacyRouteName,
  RegistrationDataPrivacyRouteParams,
} from '../../screens/account/registration/registration-data-privacy-route'
import {
  RegistrationFinishedRouteName,
  RegistrationFinishedRouteParams,
} from '../../screens/account/registration/registration-finished-route'
import {
  RegistrationFormRouteName,
  RegistrationFormRouteParams,
} from '../../screens/account/registration/registration-form-route'
import {
  RegistrationPreferencesRouteParams,
  RegistrationPreferencesRouteName,
} from '../../screens/account/registration/registration-preferences-route'
import {
  RegistrationSuccessRouteName,
  RegistrationSuccessRouteParams,
} from '../../screens/account/registration/registration-success-route'
import { AppConfigRouteName, AppConfigRouteParams } from '../../screens/app/developer-settings/app-config-route'
import {
  DarkModePreviewRouteName,
  DarkModePreviewRouteParams,
} from '../../screens/app/developer-settings/dark-mode-preview-route'
import {
  DeveloperMenuRouteName,
  DeveloperMenuRouteParams,
} from '../../screens/app/developer-settings/developer-menu-route'
import {
  EnvironmentConfigRouteName,
  EnvironmentConfigRouteParams,
} from '../../screens/app/developer-settings/environment-config-route'
import {
  NotificationsRouteName,
  NotificationsRouteParams,
} from '../../screens/app/developer-settings/notifications-route'
import {
  SimulationCardConfigRouteName,
  SimulationCardConfigRouteParams,
} from '../../screens/app/developer-settings/simulation-card-config-route'
import { StorybookRouteName, StorybookRouteParams } from '../../screens/app/developer-settings/storybook-route'
import { ForceUpdateRouteName, ForceUpdateRouteParams } from '../../screens/app/force-update-route'
import {
  OnboardingNotificationPermissionRouteName,
  OnboardingNotificationPermissionRouteParams,
} from '../../screens/app/onboarding/onboarding-notification-permission-route'
import { ReleaseNotesModalRouteName, ReleaseNotesModalRouteParams } from '../../screens/app/release-notes-modal-route'
import { LogInRouteName, LogInRouteParams } from '../../screens/auth/log-in-route'
import { LogOutRouteName, LogOutRouteParams } from '../../screens/auth/log-out-route'
import { RootStackParams, RootStackScreenProps } from '../types'

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
  [RegistrationFinishedRouteName]: RegistrationFinishedRouteParams

  [AccountDeletionConfirmRouteName]: AccountDeletionConfirmRouteParams
  [StorybookRouteName]: StorybookRouteParams
  [AccountDeletionSuccessfulRouteName]: AccountDeletionSuccessfulRouteParams

  [DeveloperMenuRouteName]: DeveloperMenuRouteParams
  [EnvironmentConfigRouteName]: EnvironmentConfigRouteParams
  [AppConfigRouteName]: AppConfigRouteParams
  [NotificationsRouteName]: NotificationsRouteParams
  [SimulationCardConfigRouteName]: SimulationCardConfigRouteParams
  [DarkModePreviewRouteName]: DarkModePreviewRouteParams

  [ReleaseNotesModalRouteName]: ReleaseNotesModalRouteParams

  [LocationSharingRouteName]: LocationSharingRouteParams

  [OnboardingNotificationPermissionRouteName]: OnboardingNotificationPermissionRouteParams

  [EditorialEmailConsentModalRouteName]: EditorialEmailConsentModalRouteParams

  [BudgetVoucherRouteName]: BudgetVoucherRouteParams

  [MobilityOffersProductDetailsRouteName]: MobilityOffersProductDetailsRouteParams
  [MobilityOffersRouteName]: MobilityOffersRouteParams
  [MobilityOffersErrorPageRouteName]: MobilityOffersErrorPageRouteParams
}

export type ModalScreenProps<RouteName extends keyof ModalParamList> = CompositeScreenProps<
  StackScreenProps<ModalParamList, RouteName>,
  RootStackScreenProps<keyof RootStackParams>
>
