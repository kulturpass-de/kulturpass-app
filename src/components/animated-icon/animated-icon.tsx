import LottieView from 'lottie-react-native'
import React, { useCallback, useImperativeHandle, useMemo } from 'react'
import { Animated, Easing, View } from 'react-native'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { calculateAnimationDuration } from '../../utils/animations/utils'
import { AvailableTranslations } from '../translated-text/types'
import { requireIconAnimation as requireIconAnimationDark } from './animations/dark'
import { requireIconAnimation as requireIconAnimationLight } from './animations/light'
import { useActivateAnimation } from './use-activate-animation'

export type AnimationIconType =
  | 'copy'
  | 'heart'
  | 'favorites-tab'
  | 'home-tab'
  | 'reservations-tab'
  | 'search-tab'
  | 'profile-tab'

export type AnimatedIconProps = {
  type: AnimationIconType
  width: number
  height: number
  i18nKey?: AvailableTranslations
  testID?: string
  speed?: number
  active: boolean
  onAnimationFinishedResetDelayMs?: number
  useNativeDriver?: boolean
}

export type AnimatedIconRef = {
  duration?: number
  playAnimation: (endCallback?: Animated.EndCallback | undefined) => void
}

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView)

export const AnimatedIcon = React.forwardRef<AnimatedIconRef, AnimatedIconProps>(
  (
    {
      type,
      width,
      height,
      i18nKey,
      testID,
      active,
      speed,
      onAnimationFinishedResetDelayMs = 0,
      useNativeDriver = true,
    },
    ref,
  ) => {
    const { t } = useTranslation()
    const { colorScheme } = useTheme()

    const { animationProgress, setAnimating } = useActivateAnimation({ active })

    const accessible = !!i18nKey

    const animation = useMemo((): { source: any; duration: number } | undefined => {
      let source
      if (colorScheme === 'dark') {
        source = requireIconAnimationDark(type)
      } else {
        source = requireIconAnimationLight(type)
      }

      if (source === undefined) {
        return
      }

      return { source, duration: calculateAnimationDuration(source) }
    }, [colorScheme, type])

    const playAnimation = useCallback(
      (endCallback: Animated.EndCallback | undefined) => {
        if (!animation) {
          return
        }

        setAnimating(true)
        animationProgress.current.setValue(0)
        const playbackDuration = animation.duration / (speed ?? 1)
        Animated.timing(animationProgress.current, {
          toValue: 1,
          duration: playbackDuration,
          easing: Easing.linear,
          useNativeDriver,
          isInteraction: true,
        }).start(({ finished }) => {
          // mark animation as not animating anymore, once finished=true, with an optional delay
          // this can make the animation stay in its end state for a specific time, for example
          if (finished) {
            setTimeout(() => setAnimating(false), onAnimationFinishedResetDelayMs)
          } else {
            setAnimating(false)
          }

          // optionally notify the parent component
          endCallback && endCallback({ finished })
        })
      },
      [animation, speed, onAnimationFinishedResetDelayMs, useNativeDriver, animationProgress, setAnimating],
    )

    useImperativeHandle(ref, () => ({ playAnimation }), [playAnimation])

    return (
      <View
        accessible={accessible}
        accessibilityLabel={accessible ? t(i18nKey) : undefined}
        accessibilityRole="image"
        testID={testID}>
        <AnimatedLottieView
          source={animation?.source}
          autoPlay={false}
          loop={false}
          progress={animationProgress.current}
          style={{ width, height }}
        />
      </View>
    )
  },
)
