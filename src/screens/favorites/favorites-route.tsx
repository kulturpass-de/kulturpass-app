import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useModalNavigation } from '../../navigation/modal/hooks'

import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { getIsUserLoggedIn } from '../../services/auth/store/auth-selectors'
import { LogInRouteConfig } from '../log-in/log-in-route'
import { FavoritesScreen, FavoritesScreenProps } from './favorites-screen'
import { FavoritesUnauthorizedScreen, type FavoritesUnauthorizedScreenProps } from './favorites-unauthorized-screen'

export const FavoritesRouteName = 'Favorites'

export type FavoritesRouteParams = undefined

export const FavoritesRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()
  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const onSignInRequested: FavoritesUnauthorizedScreenProps['onSignInRequested'] = useCallback(() => {
    modalNavigation.navigate({
      screen: LogInRouteConfig.name,
    })
  }, [modalNavigation])

  const onFavoritePressed: FavoritesScreenProps['onFavoritePressed'] = useCallback(
    (productCode: string) => {
      modalNavigation.navigate({ screen: 'ProductDetail', params: { productCode, randomMode: false } })
    },
    [modalNavigation],
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
