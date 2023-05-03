import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { PreferencesRouteParams, PreferencesRouteName } from '../../../screens/settings-tab/preferences-route'
import {
  AppInformationsRouteName,
  AppInformationsRouteParams,
} from '../../../screens/settings-tab/app-informations-route'
import { ChangeLanguageRouteName, ChangeLanguageRouteParams } from '../../../screens/settings-tab/change-language-route'
import { ViewProfileRouteName, ViewProfileRouteParams } from '../../../screens/settings-tab/view-profile-route'
import { RootStackParams, RootStackScreenProps } from '../../types'
import { DeleteAccountRouteName, DeleteAccountRouteParams } from '../../../screens/settings-tab/delete-account-route'
import { UpdateProfileRouteName, UpdateProfileRouteParams } from '../../../screens/update-profile/update-profile-route'

export type SettingsParamList = {
  [ViewProfileRouteName]: ViewProfileRouteParams
  [ChangeLanguageRouteName]: ChangeLanguageRouteParams
  [PreferencesRouteName]: PreferencesRouteParams
  [UpdateProfileRouteName]: UpdateProfileRouteParams
  [AppInformationsRouteName]: AppInformationsRouteParams
  [DeleteAccountRouteName]: DeleteAccountRouteParams
}

export type SettingsScreenProps<RouteName extends keyof SettingsParamList> = CompositeScreenProps<
  StackScreenProps<SettingsParamList, RouteName>,
  RootStackScreenProps<keyof RootStackParams>
>
