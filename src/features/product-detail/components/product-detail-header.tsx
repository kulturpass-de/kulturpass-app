import React, { useCallback, useMemo } from 'react'
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, View, ViewStyle } from 'react-native'
import FastImage from 'react-native-fast-image'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { HITSLOP } from '../../../theme/constants'
import { useTheme } from '../../../theme/hooks/use-theme'
import { UseProductDetailHeaderHeightReturnType } from '../hooks/use-product-detail-header-height'

type ProductDetailHeaderProps = UseProductDetailHeaderHeightReturnType & {
  imageUrl?: string
  onClose: () => void
  scrollY: Animated.Value
}

export const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
  onClose,
  imageUrl,
  scrollY,
  headerHeightDiff,
  onHeaderSetMaxHeight,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { buildTestId } = useTestIdBuilder()

  const onLayout = useCallback(
    (evt: LayoutChangeEvent) => {
      onHeaderSetMaxHeight(Math.floor(evt.nativeEvent.layout.width))
    },
    [onHeaderSetMaxHeight],
  )

  const headerTransformStyle: Animated.AnimatedProps<ViewStyle> = useMemo(() => {
    if (headerHeightDiff === null) {
      return {}
    }

    const headerTranslate = scrollY.interpolate({
      inputRange: [0, headerHeightDiff],
      outputRange: [0, -headerHeightDiff],
      extrapolate: 'clamp',
    })
    return {
      transform: [{ translateY: headerTranslate }],
    }
  }, [scrollY, headerHeightDiff])

  const overlayOpacityStyle: Animated.AnimatedProps<ViewStyle> = useMemo(() => {
    if (headerHeightDiff === null) {
      return {}
    }

    const overlayOpacity = scrollY.interpolate({
      inputRange: [0, headerHeightDiff],
      outputRange: [0.0, 0.75],
      extrapolate: 'clamp',
    })
    return {
      opacity: overlayOpacity,
    }
  }, [scrollY, headerHeightDiff])

  return (
    <View testID={buildTestId('productDetail_header')} style={styles.container} onLayout={onLayout}>
      <Animated.View style={headerTransformStyle}>
        <FastImage
          testID={buildTestId('productDetail_header_image')}
          accessibilityLabel={t('productDetail_header_image')}
          resizeMode={FastImage.resizeMode.contain}
          style={[styles.image, { backgroundColor: colors.secondaryBackground }]}
          source={{ uri: imageUrl }}
        />
        <Animated.View style={[styles.overlay, { backgroundColor: colors.secondaryBackground }, overlayOpacityStyle]} />
      </Animated.View>
      <Pressable
        hitSlop={HITSLOP}
        style={styles.closeButtonContainer}
        testID={buildTestId('productDetail_header_closeButton')}
        accessibilityRole="button"
        accessibilityLabel={t('productDetail_header_closeButton')}
        onPress={onClose}>
        <View style={[styles.closeButton, { backgroundColor: colors.secondaryBackground }]}>
          <SvgImage type="close" width={24} height={24} />
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    height: '100%',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 7,
    right: 16,
  },
  closeButton: {
    borderRadius: 24,
    height: 42,
    width: 42,
    opacity: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
