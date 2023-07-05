import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import {
  AppInformationsRouteName,
  AppInformationsRouteParams,
} from '../../../screens/profile-tab/app-informations-route'
import { ChangeLanguageRouteName, ChangeLanguageRouteParams } from '../../../screens/profile-tab/change-language-route'
import { ContactRouteName, ContactRouteParams } from '../../../screens/profile-tab/contact-route'
import { DeleteAccountRouteName, DeleteAccountRouteParams } from '../../../screens/profile-tab/delete-account-route'
import { PreferencesRouteParams, PreferencesRouteName } from '../../../screens/profile-tab/preferences-route'
import { ViewProfileRouteName, ViewProfileRouteParams } from '../../../screens/profile-tab/view-profile-route'
import { UpdateProfileRouteName, UpdateProfileRouteParams } from '../../../screens/update-profile/update-profile-route'
import { RootStackParams, RootStackScreenProps } from '../../types'

export type SettingsParamList = {
  [ViewProfileRouteName]: ViewProfileRouteParams
  [ChangeLanguageRouteName]: ChangeLanguageRouteParams
  [PreferencesRouteName]: PreferencesRouteParams
  [UpdateProfileRouteName]: UpdateProfileRouteParams
  [ContactRouteName]: ContactRouteParams
  [AppInformationsRouteName]: AppInformationsRouteParams
  [DeleteAccountRouteName]: DeleteAccountRouteParams
}

export type SettingsScreenProps<RouteName extends keyof SettingsParamList> = CompositeScreenProps<
  StackScreenProps<SettingsParamList, RouteName>,
  RootStackScreenProps<keyof RootStackParams>
>
