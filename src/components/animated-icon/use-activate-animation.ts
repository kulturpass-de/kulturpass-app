import { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'

export const useActivateAnimation = ({ active }: { active: boolean }) => {
  const [animating, setAnimating] = useState(false)
  const animationProgress = useRef(new Animated.Value(0))

  useEffect(() => {
    if (!active && animating) {
      animationProgress.current.resetAnimation()
    } else if (!animating) {
      animationProgress.current.setValue(active ? 1 : 0)
    }
  }, [active, animating])

  return {
    animationProgress,
    setAnimating,
  }
}
