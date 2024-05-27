import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import {
  EditorialEmailConsentScreenRouteName,
  EditorialEmailConsentScreenRouteParams,
} from '../../../features/delta-onboarding/screens/editorial-email-consent-screen-route'
import {
  DeleteAccountRouteName,
  DeleteAccountRouteParams,
} from '../../../screens/account/delete-account/delete-account-route'
import {
  ChangeLanguageRouteName,
  ChangeLanguageRouteParams,
} from '../../../screens/account/preferences/change-language-route'
import { PreferencesRouteParams, PreferencesRouteName } from '../../../screens/account/preferences/preferences-route'
import { UpdateProfileRouteName, UpdateProfileRouteParams } from '../../../screens/account/profile/update-profile-route'
import { ViewProfileRouteName, ViewProfileRouteParams } from '../../../screens/account/profile/view-profile-route'
import { AppInformationsRouteName, AppInformationsRouteParams } from '../../../screens/app/app-informations-route'
import { ContactRouteName, ContactRouteParams } from '../../../screens/app/contact-route'
import { ReleaseNotesRouteName, ReleaseNotesRouteParams } from '../../../screens/app/release-notes-route'
import { RootStackParams, RootStackScreenProps } from '../../types'

export type SettingsParamList = {
  [ViewProfileRouteName]: ViewProfileRouteParams
  [ChangeLanguageRouteName]: ChangeLanguageRouteParams
  [PreferencesRouteName]: PreferencesRouteParams
  [UpdateProfileRouteName]: UpdateProfileRouteParams
  [ContactRouteName]: ContactRouteParams
  [AppInformationsRouteName]: AppInformationsRouteParams
  [ReleaseNotesRouteName]: ReleaseNotesRouteParams
  [DeleteAccountRouteName]: DeleteAccountRouteParams
  [EditorialEmailConsentScreenRouteName]: EditorialEmailConsentScreenRouteParams
}

export type SettingsScreenProps<RouteName extends keyof SettingsParamList> = CompositeScreenProps<
  StackScreenProps<SettingsParamList, RouteName>,
  RootStackScreenProps<keyof RootStackParams>
>
