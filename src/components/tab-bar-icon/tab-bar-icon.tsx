import React from 'react'
import { Image, ImageSourcePropType, StyleSheet } from 'react-native'

import { TabsParamList } from '../../navigation/tabs/types'

import HomeActiveIcon from './icons/home-active.png'
import HomeInactiveIcon from './icons/home-inactive.png'
import SearchActiveIcon from './icons/search-active.png'
import SearchInactiveIcon from './icons/search-inactive.png'
import ReservationsActiveIcon from './icons/reservations-active.png'
import ReservationsInactiveIcon from './icons/reservations-inactive.png'
import FavoritesActiveIcon from './icons/favorites-active.png'
import FavoritesInactiveIcon from './icons/favorites-inactive.png'
import ProfileActiveIcon from './icons/profile-active.png'
import ProfileInactiveIcon from './icons/profile-inactive.png'

const icons: {
  active: { [key in keyof TabsParamList]: ImageSourcePropType }
  inactive: { [key in keyof TabsParamList]: ImageSourcePropType }
} = {
  active: {
    Home: HomeActiveIcon,
    Search: SearchActiveIcon,
    Reservations: ReservationsActiveIcon,
    Favorites: FavoritesActiveIcon,
    Settings: ProfileActiveIcon,
  },
  inactive: {
    Home: HomeInactiveIcon,
    Search: SearchInactiveIcon,
    Reservations: ReservationsInactiveIcon,
    Favorites: FavoritesInactiveIcon,
    Settings: ProfileInactiveIcon,
  },
}

export type TabBarIconProps = {
  name: keyof TabsParamList
  isFocused?: boolean
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ isFocused, name }) => {
  const source = icons[isFocused ? 'active' : 'inactive'][name]

  return <Image style={styles.icon} source={source} />
}

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 36,
  },
})
