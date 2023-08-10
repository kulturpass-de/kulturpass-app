import React from 'react'
import { TabsScreenProps } from '../../navigation/tabs/types'
import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { SearchScreen } from './search-screen'

export const SearchRouteName = 'Search'

export type SearchRouteParams = undefined

export const SearchRoute: React.FC<TabsScreenProps<'Search'>> = () => {
  return <SearchScreen />
}

export const SearchRouteConfig = createRouteConfig({
  name: SearchRouteName,
  component: SearchRoute,
})
