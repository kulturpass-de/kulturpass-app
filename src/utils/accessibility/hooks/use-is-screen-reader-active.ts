import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

export const useIsScreenReaderActive = () => {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false)
  useEffect(() => {
    const screenReaderChangedSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      isScreenReaderEnabled => {
        setScreenReaderEnabled(isScreenReaderEnabled)
      },
    )

    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled)

    return screenReaderChangedSubscription.remove
  }, [])

  return screenReaderEnabled
}
