import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

export const useIsReduceMotionActive = () => {
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false)
  useEffect(() => {
    const reduceMotionChangedSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotionEnabled,
    )

    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotionEnabled)

    return reduceMotionChangedSubscription.remove
  }, [])

  return reduceMotionEnabled
}
