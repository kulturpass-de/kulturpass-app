import { StackNavigationOptions } from '@react-navigation/stack'
import { ModalParamList, ModalScreenProps } from '../modal/types'
import { SettingsParamList, SettingsScreenProps } from '../tabs/settings/types'
import { TabsScreenProps, TabsParamList } from '../tabs/types'

type RouteName = keyof ModalParamList | keyof TabsParamList | keyof SettingsParamList

type ComponentProps<R extends RouteName> = R extends keyof ModalParamList
  ? ModalScreenProps<R>
  : R extends keyof TabsParamList
  ? TabsScreenProps<R>
  : R extends keyof SettingsParamList
  ? SettingsScreenProps<R>
  : never

export const createRouteConfig = <R extends RouteName, P extends ComponentProps<R>>(config: {
  name: R
  component: React.FC<P>
  options?: StackNavigationOptions | ((props: any) => StackNavigationOptions)
}) => config
