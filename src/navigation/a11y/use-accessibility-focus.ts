import type { MutableRefObject } from 'react'
import { useCallback, useRef } from 'react'
import { AccessibilityInfo, InteractionManager, Platform, findNodeHandle } from 'react-native'

export type AccessibilityFocusPlatform = 'ios' | 'android' | 'both'

/**
 * Returns a ref object which when bound to an element, will focus that
 * element in VoiceOver/TalkBack on its appearance
 */
export default function useAccessibilityFocus(
  platform: AccessibilityFocusPlatform = 'both',
  timeout = 0,
): [MutableRefObject<any>, () => void] {
  const ref = useRef(null)

  const setFocusCallback = useCallback(() => {
    setTimeout(() => {
      if (!ref.current) {
        return
      }
      const focusPoint = findNodeHandle(ref.current)

      if (focusPoint) {
        AccessibilityInfo.setAccessibilityFocus(focusPoint)
      }
    }, timeout)
  }, [timeout])

  const setFocus = useCallback(() => {
    if ((platform === 'both' || Platform.OS === platform) && ref.current) {
      if (Platform.OS === 'android') {
        requestAnimationFrame(setFocusCallback)
      } else {
        InteractionManager.runAfterInteractions(setFocusCallback)
      }
    }
  }, [platform, setFocusCallback])

  return [ref, setFocus]
}
