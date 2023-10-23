import React, { useCallback, useRef, useState } from 'react'
import { AccessibilityInfo, InteractionManager, Pressable, StyleProp, ViewStyle } from 'react-native'
import { AvailableTranslations } from '../../components/translated-text/types'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { HITSLOP } from '../../theme/constants'
import { useIsReduceMotionActive } from '../../utils/accessibility/hooks/use-is-reduce-motion-active'
import { AnimatedIcon, AnimatedIconRef } from '../animated-icon/animated-icon'
import { SvgImage } from '../svg-image/svg-image'

const DELAY_ON_END_CALLBACK_MS = 3500

const pressedStateType = (pressed: boolean) => (pressed ? 'copy-clipboard' : 'clipboard')

export type CopyToClipboardProps = {
  baseTestId: string
  accessibilityLabelI18nKey: AvailableTranslations
  copiedAccessibilityI18nKey: AvailableTranslations
  onPress: () => void
  style?: StyleProp<ViewStyle>
  size?: number
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  baseTestId,
  accessibilityLabelI18nKey,
  copiedAccessibilityI18nKey,
  onPress,
  style,
  size = 24,
}) => {
  const { t } = useTranslation()
  const { addTestIdModifier } = useTestIdBuilder()
  const animatedIconRef = useRef<AnimatedIconRef>(null)
  const isReduceMotionActive = useIsReduceMotionActive()
  const [isAnimating, setIsAnimating] = useState(false)

  const animationFinishedCallback = useCallback(() => {
    setTimeout(() => {
      setIsAnimating(false)
    }, DELAY_ON_END_CALLBACK_MS)
  }, [])

  const copiedAccessibilityAnnouncement = useCallback(() => {
    AccessibilityInfo.announceForAccessibilityWithOptions(t(copiedAccessibilityI18nKey), { queue: true })
  }, [t, copiedAccessibilityI18nKey])

  const handlePress = useCallback(() => {
    if (!isReduceMotionActive && !isAnimating) {
      setIsAnimating(true)

      // let animation start smoothly after interaction on the main thread are finished
      InteractionManager.runAfterInteractions(() => {
        animatedIconRef.current?.playAnimation(({ finished }) => {
          copiedAccessibilityAnnouncement()

          if (finished) {
            animationFinishedCallback()
          }
        })
      })
    } else if (isReduceMotionActive && !isAnimating) {
      setIsAnimating(true)
      copiedAccessibilityAnnouncement()
      animationFinishedCallback()
    }

    onPress()
  }, [isReduceMotionActive, onPress, isAnimating, animationFinishedCallback, copiedAccessibilityAnnouncement])

  return (
    <Pressable
      hitSlop={HITSLOP}
      accessible
      testID={addTestIdModifier(baseTestId, 'copyToClipboard')}
      accessibilityRole="button"
      accessibilityLabel={t(accessibilityLabelI18nKey)}
      style={style}
      onPress={handlePress}>
      {({ pressed }) =>
        isReduceMotionActive ? (
          <SvgImage type={isAnimating ? 'check' : pressedStateType(pressed)} width={size} height={size} />
        ) : (
          <AnimatedIcon
            ref={animatedIconRef}
            speed={1.5}
            active={false}
            type="copy"
            width={size}
            height={size}
            onAnimationFinishedResetDelayMs={DELAY_ON_END_CALLBACK_MS}
            useNativeDriver={false}
          />
        )
      }
    </Pressable>
  )
}
