import { useContext } from 'react'
import { AccessibilityContext } from '../components/accessibility-provider'

export const useIsReduceMotionActive = () => {
  const context = useContext(AccessibilityContext)

  if (!context) {
    throw new Error('AccessibilityContext used outside of AccessibilityProvider.')
  }

  return context.reduceMotionEnabled
}
