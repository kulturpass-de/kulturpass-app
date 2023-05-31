import React, { useMemo } from 'react'
import FastImage from 'react-native-fast-image'
import { Animated, Pressable, StyleSheet, View, ViewStyle } from 'react-native'
import { Icon } from '../../../components/icon/icon'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { useTranslation } from '../../../services/translation/translation'
import { HITSLOP } from '../../../theme/constants'

type ProductDetailHeaderProps = {
  imageUrl?: string
  onClose: () => void
  scrollY: Animated.Value
}

export const PRODUCT_DETAIL_HEADER_MAX_HEIGHT = 280
export const PRODUCT_DETAIL_HEADER_MIN_HEIGHT = 56
export const PRODUCT_DETAIL_HEADER_HEIGHT_DIFF = PRODUCT_DETAIL_HEADER_MAX_HEIGHT - PRODUCT_DETAIL_HEADER_MIN_HEIGHT

export const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({ onClose, imageUrl, scrollY }) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  const headerTransformStyle: Animated.AnimatedProps<ViewStyle> = useMemo(() => {
    const headerTranslate = scrollY.interpolate({
      inputRange: [0, PRODUCT_DETAIL_HEADER_HEIGHT_DIFF],
      outputRange: [0, -PRODUCT_DETAIL_HEADER_HEIGHT_DIFF],
      extrapolate: 'clamp',
    })
    return {
      transform: [{ translateY: headerTranslate }],
    }
  }, [scrollY])

  const overlayOpacityStyle: Animated.AnimatedProps<ViewStyle> = useMemo(() => {
    const overlayOpacity = scrollY.interpolate({
      inputRange: [0, PRODUCT_DETAIL_HEADER_HEIGHT_DIFF],
      outputRange: [0.0, 0.75],
      extrapolate: 'clamp',
    })
    return {
      opacity: overlayOpacity,
    }
  }, [scrollY])

  return (
    <View testID={buildTestId('productDetail_header')} style={styles.container}>
      <Animated.View style={headerTransformStyle}>
        <FastImage
          testID={buildTestId('productDetail_header_image')}
          accessibilityLabel={t('productDetail_header_image')}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.image}
          source={{ uri: imageUrl }}
          defaultSource={require('./dummy-placeholder.png')}
        />
        <Animated.View style={[styles.overlay, overlayOpacityStyle]} />
      </Animated.View>
      <Pressable
        hitSlop={HITSLOP}
        style={styles.closeButtonContainer}
        testID={buildTestId('productDetail_header_closeButton')}
        accessibilityRole="button"
        accessibilityLabel={t('productDetail_header_closeButton')}
        onPress={onClose}>
        <View style={styles.closeButton}>
          <Icon source="Close" width={24} height={24} />
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
    backgroundColor: colors.basicWhite,
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
    height: PRODUCT_DETAIL_HEADER_MAX_HEIGHT,
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
    backgroundColor: colors.basicWhite,
    opacity: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
