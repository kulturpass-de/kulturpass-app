import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { TabsParamList } from './types'

export const useTabsNavigation = () =>
  useNavigation<BottomTabScreenProps<TabsParamList, keyof TabsParamList>['navigation']>()

// FIX ME, this does not take into account the second level
export const useTabsRoute = <RouteName extends keyof TabsParamList>() =>
  useRoute<StackScreenProps<TabsParamList, RouteName>['route']>()
