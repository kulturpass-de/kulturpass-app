import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { RootStackParams } from '../../navigation/types'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { getIsUserLoggedIn } from '../../services/auth/store/auth-selectors'
import { LogInRouteConfig } from '../auth/log-in-route'
import { FavoritesScreen, FavoritesScreenProps } from './favorites-screen'
import { FavoritesUnauthorizedScreen, type FavoritesUnauthorizedScreenProps } from './favorites-unauthorized-screen'

export const FavoritesRouteName = 'Favorites'

export type FavoritesRouteParams = undefined

export const FavoritesRoute: React.FC = () => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const modalNavigation = useModalNavigation()
  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const onSignInRequested: FavoritesUnauthorizedScreenProps['onSignInRequested'] = useCallback(() => {
    modalNavigation.navigate({
      screen: LogInRouteConfig.name,
    })
  }, [modalNavigation])

  const onFavoritePressed: FavoritesScreenProps['onFavoritePressed'] = useCallback(
    (productCode: string) => {
      rootNavigation.navigate('PDP', { screen: 'ProductDetail', params: { productCode, randomMode: false } })
    },
    [rootNavigation],
  )

  return isLoggedIn ? (
    <FavoritesScreen onFavoritePressed={onFavoritePressed} />
  ) : (
    <FavoritesUnauthorizedScreen onSignInRequested={onSignInRequested} />
  )
}

export const FavoritesRouteConfig = createRouteConfig({
  name: FavoritesRouteName,
  component: FavoritesRoute,
})
