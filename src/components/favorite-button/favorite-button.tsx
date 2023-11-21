import debounce from 'lodash.debounce'
import React, { useCallback, useRef } from 'react'
import { Pressable, PressableProps } from 'react-native'
import { SpartacusBridge } from '../../features/spartacus-webview/services/webview-bridge-adapter/spartacus-bridge'
import { BridgeToAllError } from '../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { webViewBridgeAdapter } from '../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { logger } from '../../services/logger'
import { TestId } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { HITSLOP } from '../../theme/constants'
import { useIsReduceMotionActive } from '../../utils/accessibility/hooks/use-is-reduce-motion-active'
import { AnimatedIcon, AnimatedIconRef } from '../animated-icon/animated-icon'
import { SvgImage } from '../svg-image/svg-image'

export type FavoriteButtonProps = {
  isFavorite: boolean
  onPress: () => Promise<void>
  testID: TestId
  hitSlop?: PressableProps['hitSlop']
  size?: number
}

const DEBOUNCE_MS = 500

const refreshWebviewFavorites = debounce(
  () =>
    webViewBridgeAdapter
      .callBridgeFunctionToAll(SpartacusBridge.FunctionCall.Target.FavouritesRefresh, [])
      .then(results => {
        results.forEach(result => {
          if (result.status === 'rejected') {
            const reason: BridgeToAllError = result.reason
            logger.logError(`${reason.webViewId} Refreshing Favorites`, reason.error, true)
          }
        })
      }),
  DEBOUNCE_MS,
  { leading: false, trailing: true },
)

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onPress, testID, hitSlop, size = 36 }) => {
  const { t } = useTranslation()
  const animatedIconRef = useRef<AnimatedIconRef>(null)
  const isReduceMotionActive = useIsReduceMotionActive()

  const handlePress = useCallback(async () => {
    if (!isReduceMotionActive && !isFavorite) {
      animatedIconRef.current?.playAnimation()
    }
    await onPress()
    refreshWebviewFavorites()
  }, [isFavorite, isReduceMotionActive, onPress])

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? t('favorites_item_remove_a11y_label') : t('favorites_item_add_a11y_label')}
      testID={testID}
      onPress={handlePress}
      hitSlop={hitSlop || HITSLOP}>
      {isReduceMotionActive ? (
        <SvgImage type={isFavorite ? 'heart-selected' : 'heart-unselected'} width={size} height={size} />
      ) : (
        <AnimatedIcon ref={animatedIconRef} speed={1.5} active={isFavorite} type="heart" width={size} height={size} />
      )}
    </Pressable>
  )
}
