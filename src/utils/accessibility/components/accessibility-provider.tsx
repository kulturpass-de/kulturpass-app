import React, { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

export type AccessibilityValue = {
  reduceMotionEnabled: boolean
  screenReaderEnabled: boolean
  boldTextEnabled: boolean
}

export const AccessibilityContext = createContext<AccessibilityValue | null>(null)

export const AccessibilityProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false)
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false)
  const [boldTextEnabled, setBoldTextEnabled] = useState(false)

  useEffect(() => {
    const screenReaderChangedSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled,
    )
    const reduceMotionChangedSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotionEnabled,
    )
    const boldTextChangedSubscription = AccessibilityInfo.addEventListener('boldTextChanged', setBoldTextEnabled)

    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled)
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotionEnabled)
    AccessibilityInfo.isBoldTextEnabled().then(setBoldTextEnabled)

    return () => {
      screenReaderChangedSubscription.remove()
      reduceMotionChangedSubscription.remove()
      boldTextChangedSubscription.remove()
    }
  }, [])

  const providerValue: AccessibilityValue = useMemo(
    () => ({ reduceMotionEnabled, screenReaderEnabled, boldTextEnabled }),
    [reduceMotionEnabled, screenReaderEnabled, boldTextEnabled],
  )

  return <AccessibilityContext.Provider value={providerValue}>{children}</AccessibilityContext.Provider>
}
