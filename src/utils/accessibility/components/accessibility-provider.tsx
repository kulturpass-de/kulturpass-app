import React, { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { AccessibilityInfo, NativeModules, Platform } from 'react-native'

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

  const checkIsAndroidBoldTextEnabled = useCallback(() => {
    if (Platform.OS === 'android' && NativeModules.KPCustomModule) {
      // if bold font is enabled, a value greater than 0 should be returned
      NativeModules.KPCustomModule.isBoldTextEnabled().then(fontWeight => setBoldTextEnabled(Boolean(fontWeight)))
    } else if (Platform.OS === 'android') {
      throw new Error("The native module 'KPCustomModule' doesn't seem to be linked. Please rebuild the project.")
    }
  }, [])

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
    checkIsAndroidBoldTextEnabled()

    return () => {
      screenReaderChangedSubscription.remove()
      reduceMotionChangedSubscription.remove()
      boldTextChangedSubscription.remove()
    }
  }, [checkIsAndroidBoldTextEnabled])

  const providerValue: AccessibilityValue = useMemo(
    () => ({ reduceMotionEnabled, screenReaderEnabled, boldTextEnabled }),
    [reduceMotionEnabled, screenReaderEnabled, boldTextEnabled],
  )

  return <AccessibilityContext.Provider value={providerValue}>{children}</AccessibilityContext.Provider>
}
