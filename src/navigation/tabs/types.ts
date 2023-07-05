import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { FavoritesRouteName, FavoritesRouteParams } from '../../screens/favorites/favorites-route'
import { HomeRouteName, HomeRouteParams } from '../../screens/home/home-route'
import { ReservationsRouteName, ReservationsRouteParams } from '../../screens/reservations/reservations-route'
import { SearchRouteName, SearchRouteParams } from '../../screens/search/search-route'
import { RootStackParams, RootStackScreenProps } from '../types'
import { SettingsParamList } from './settings/types'

export type TabsParamList = {
  [HomeRouteName]: HomeRouteParams
  [SearchRouteName]: SearchRouteParams
  [ReservationsRouteName]: ReservationsRouteParams
  [FavoritesRouteName]: FavoritesRouteParams
  Settings: NavigatorScreenParams<SettingsParamList> | undefined
}

export type TabsScreenProps<RouteName extends keyof TabsParamList> = CompositeScreenProps<
  StackScreenProps<TabsParamList, RouteName>,
  RootStackScreenProps<keyof RootStackParams>
>
