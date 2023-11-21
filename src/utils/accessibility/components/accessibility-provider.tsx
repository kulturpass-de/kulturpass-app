import React, { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

export type AccessibilityValue = {
  reduceMotionEnabled: boolean
  screenReaderEnabled: boolean
}

export const AccessibilityContext = createContext<AccessibilityValue | null>(null)

export const AccessibilityProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false)
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false)

  useEffect(() => {
    const screenReaderChangedSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled,
    )
    const reduceMotionChangedSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotionEnabled,
    )

    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled)
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotionEnabled)

    return () => {
      screenReaderChangedSubscription.remove()
      reduceMotionChangedSubscription.remove()
    }
  }, [])

  const providerValue: AccessibilityValue = useMemo(
    () => ({ reduceMotionEnabled, screenReaderEnabled }),
    [reduceMotionEnabled, screenReaderEnabled],
  )

  return <AccessibilityContext.Provider value={providerValue}>{children}</AccessibilityContext.Provider>
}
