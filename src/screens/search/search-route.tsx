import React from 'react'
import { TabsScreenProps } from '../../navigation/tabs/types'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { SearchScreen } from './search-screen'

export const SearchRouteName = 'Search'

export type SearchRouteParams =
  | undefined
  | {
      initialNavigationUrl: string
    }

export const SearchRoute: React.FC<TabsScreenProps<'Search'>> = ({ route }) => {
  return <SearchScreen initialNavigationUrl={route.params?.initialNavigationUrl} />
}

export const SearchRouteConfig = createRouteConfig({
  name: SearchRouteName,
  component: SearchRoute,
})
