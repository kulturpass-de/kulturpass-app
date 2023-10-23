import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

export const useIsScreenReaderActive = () => {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false)
  useEffect(() => {
    const screenReaderChangedSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled,
    )

    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled)

    return screenReaderChangedSubscription.remove
  }, [])

  return screenReaderEnabled
}
