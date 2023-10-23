import React, { useEffect, useMemo, useRef, useState } from 'react'
import { TabsParamList } from '../../navigation/tabs/types'
import { AnimatedIcon, AnimatedIconRef, AnimationIconType } from '../animated-icon/animated-icon'
import { SvgImage, ThemedSvgImageType } from '../svg-image/svg-image'

const icons: {
  active: { [key in keyof TabsParamList]: ThemedSvgImageType }
  inactive: { [key in keyof TabsParamList]: ThemedSvgImageType }
  animation: { [key in keyof TabsParamList]: AnimationIconType }
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
  animation: {
    Home: 'home-tab',
    Search: 'search-tab',
    Reservations: 'reservations-tab',
    Favorites: 'favorites-tab',
    Settings: 'profile-tab',
  },
}

export type TabBarIconProps = {
  name: keyof TabsParamList
  isFocused?: boolean
  isReduceMotionActive: boolean
}

export const TabBarIcon: React.FC<TabBarIconProps> = React.memo(({ isFocused, name, isReduceMotionActive }) => {
  const animatedIconRef = useRef<AnimatedIconRef>(null)
  const [internalIsFocused, setInternalIsFocused] = useState(isFocused)
  const previousFocus = useRef(isFocused)
  const source = useMemo(() => icons[isFocused ? 'active' : 'inactive'][name], [isFocused, name])
  const animationSource = useMemo(() => {
    return icons.animation[name]
  }, [name])

  useEffect(() => {
    if (!isReduceMotionActive && isFocused && previousFocus.current !== isFocused) {
      animatedIconRef.current?.playAnimation()
    }
    previousFocus.current = isFocused
    setInternalIsFocused(isFocused)
  }, [isFocused, isReduceMotionActive])

  return isReduceMotionActive ? (
    <SvgImage type={source} width={40} height={36} />
  ) : (
    <AnimatedIcon
      ref={animatedIconRef}
      active={internalIsFocused === true}
      speed={1.9}
      type={animationSource}
      width={40}
      height={36}
    />
  )
})
