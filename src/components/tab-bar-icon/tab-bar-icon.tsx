import React from 'react'
import { TabsParamList } from '../../navigation/tabs/types'
import { SvgImage, ThemedSvgImageType } from '../svg-image/svg-image'

const icons: {
  active: { [key in keyof TabsParamList]: ThemedSvgImageType }
  inactive: { [key in keyof TabsParamList]: ThemedSvgImageType }
} = {
  active: {
    Home: 'home-active',
    Search: 'search-active',
    Reservations: 'reservations-active',
    Favorites: 'favorites-active',
    Settings: 'profile-active',
  },
  inactive: {
    Home: 'home-inactive',
    Search: 'search-inactive',
    Reservations: 'reservations-inactive',
    Favorites: 'favorites-inactive',
    Settings: 'profile-inactive',
  },
}

export type TabBarIconProps = {
  name: keyof TabsParamList
  isFocused?: boolean
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ isFocused, name }) => {
  const source = icons[isFocused ? 'active' : 'inactive'][name]

  return <SvgImage type={source} width={40} height={36} />
}
