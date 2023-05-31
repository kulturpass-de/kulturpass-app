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

  const setFocus = useCallback(() => {
    if (platform === 'both' || Platform.OS === platform) {
      if (ref.current) {
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            const focusPoint = findNodeHandle(ref.current)
            if (focusPoint) {
              AccessibilityInfo.setAccessibilityFocus(focusPoint)
            }
          }, timeout)
        })
      }
    }
  }, [ref, platform, timeout])

  return [ref, setFocus]
}
