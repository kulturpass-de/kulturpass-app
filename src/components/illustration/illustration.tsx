import { useIsFocused } from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import React, { useEffect, useMemo, useRef } from 'react'
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  InteractionManager,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native'
import { useTranslation } from '../../services/translation/translation'
import {
  requireIllustrationImage as requireIllustrationImageDark,
  requireIllustrationAnimation as requireIllustrationAnimationDark,
} from '../../theme/dark/illustrations'
import { useTheme } from '../../theme/hooks/use-theme'
import {
  requireIllustrationImage as requireIllustrationImageLight,
  requireIllustrationAnimation as requireIllustrationAnimationLight,
} from '../../theme/light/illustrations'
import { RequiredAnimatedIllustration } from '../../theme/types'
import { useIsReduceMotionActive } from '../../utils/accessibility/hooks/use-is-reduce-motion-active'
import { calculateAnimationDuration, getAnimationSize } from '../../utils/animations/utils'
import { AvailableTranslations } from '../translated-text/types'

export type IllustrationType =
  | AnimatedIllustrationType
  | 'data-privacy'
  | 'eid'
  | 'eid-card-positioning-ios'
  | 'eid-card-positioning-android'
  | 'eid-nfc-disabled'
  | 'success'
  | 'budget-received'
  | 'stop-sign'
  | 'delete-account'
  | 'no-network'
  | 'location-sharing'
  | 'password'

export type AnimatedIllustrationType =
  | 'onboarding'
  | 'empty-state-reservations'
  | 'empty-state-reservations-closed'
  | 'favorites-empty-state'
  | 'registration-finished'
  | 'verify-mail'
  | 'release-notes'
  | 'localisation-consent'
  | 'notification-permission'

export type IllustrationProps = {
  type: IllustrationType
  i18nKey: AvailableTranslations
  testID: string
  style?: ViewProps['style']
  animationSpeed?: number
}

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView)

export const Illustration: React.FC<IllustrationProps> = ({ type, i18nKey, testID, style, animationSpeed }) => {
  const { colorScheme } = useTheme()
  const { t } = useTranslation()
  const animationProgress = useRef(new Animated.Value(0))

  const animationRef = useRef<LottieView>(null)
  const isReduceMotionActive = useIsReduceMotionActive()
  const isFocused = useIsFocused()

  const animation = useMemo(():
    | { source: RequiredAnimatedIllustration; duration: number; size: { width: number; height: number } }
    | undefined => {
    if (!isReduceMotionActive) {
      let source
      if (colorScheme === 'dark') {
        source = requireIllustrationAnimationDark(type)
      } else {
        source = requireIllustrationAnimationLight(type)
      }

      if (source === undefined) {
        return
      }

      return { source, duration: calculateAnimationDuration(source), size: getAnimationSize(source) }
    }
  }, [colorScheme, isReduceMotionActive, type])

  const image: ImageSourcePropType = useMemo(() => {
    if (colorScheme === 'dark') {
      return requireIllustrationImageDark(type)
    } else {
      return requireIllustrationImageLight(type)
    }
  }, [colorScheme, type])

  useEffect(() => {
    if (animation !== undefined) {
      if (isFocused) {
        // Play Animation of illustration after all screen transitions are done
        InteractionManager.runAfterInteractions(() => {
          animationProgress.current.setValue(0)
          const playbackDuration = animation.duration / (animationSpeed ?? 1)
          Animated.timing(animationProgress.current, {
            toValue: 1,
            duration: playbackDuration,
            easing: Easing.linear,
            useNativeDriver: true,
            isInteraction: true,
          }).start()
        })
      } else {
        animationProgress.current.resetAnimation()
      }
    }
  }, [animation, animationSpeed, isFocused])

  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="image"
      accessibilityLabel={t(i18nKey)}
      style={[styles.container, style]}>
      {animation !== undefined ? (
        <AnimatedLottieView
          ref={animationRef}
          source={animation.source}
          loop={false}
          autoPlay={false}
          resizeMode="cover"
          progress={animationProgress.current}
          style={[animation.size, styles.image]}
        />
      ) : (
        <Image source={image} resizeMode="contain" style={styles.image} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    maxWidth: '100%',
  },
})
