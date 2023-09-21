import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Animated, LayoutChangeEvent, Share, StyleSheet, View, ViewStyle } from 'react-native'
import FastImage from 'react-native-fast-image'
import { CircleIconButton } from '../../../components/circle-icon-button/circle-icon-button'
import { useEnvironmentConfigurationCommerce } from '../../../services/environment-configuration/hooks/use-environment-configuration'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { useIsScreenReaderActive } from '../../../utils/accessibility/hooks/use-is-screen-reader-active'
import { createProductLink } from '../../../utils/links/utils'
import { UseProductDetailHeaderHeightReturnType } from '../hooks/use-product-detail-header-height'
import { ProductDetail } from '../types/product-detail'

type ProductDetailHeaderProps = UseProductDetailHeaderHeightReturnType & {
  imageUrl?: string
  onClose: () => void
  scrollY: Animated.Value
  productDetail: ProductDetail
}

const SHARE_BUTTON_TRANSITION_DISTANCE = 32
const SHARE_BUTTON_HIDDEN_POSITION = 20

export const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
  onClose,
  imageUrl,
  scrollY,
  headerHeightDiff,
  headerMinHeight,
  onHeaderSetMaxHeight,
  productDetail,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const testID = buildTestId('productDetail_header')

  const isScreenReaderActive = useIsScreenReaderActive()
  const [shareButtonInHeader, setShareButtonInHeader] = useState(false)

  const homeUrl = useEnvironmentConfigurationCommerce().homeUrl

  const onShare = useCallback(() => {
    const productUrl = createProductLink(homeUrl, productDetail.code, productDetail.name)

    Share.share({
      message: t('productDetail_header_shareButton_message', { link: productUrl }),
    })
  }, [homeUrl, productDetail.code, productDetail.name, t])

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

  const shareButtonStyle: Animated.AnimatedProps<ViewStyle> = useMemo(() => {
    if (headerHeightDiff === null || headerMinHeight === null || isScreenReaderActive) {
      return {}
    }

    const shareButtonOpacity = scrollY.interpolate({
      inputRange: [
        headerHeightDiff - headerMinHeight - SHARE_BUTTON_TRANSITION_DISTANCE - SHARE_BUTTON_HIDDEN_POSITION,
        headerHeightDiff - headerMinHeight - SHARE_BUTTON_HIDDEN_POSITION,
      ],
      outputRange: [1.0, 0.0],
      extrapolate: 'clamp',
    })
    return {
      opacity: shareButtonOpacity,
    }
  }, [headerHeightDiff, headerMinHeight, isScreenReaderActive, scrollY])

  useEffect(() => {
    if (headerHeightDiff === null) {
      return
    }

    const id = scrollY.addListener(({ value }) => {
      const buttonsOverlapping = value > headerHeightDiff
      if (buttonsOverlapping !== shareButtonInHeader) {
        setShareButtonInHeader(buttonsOverlapping)
      }
    })
    return () => scrollY.removeListener(id)
  }, [headerHeightDiff, scrollY, shareButtonInHeader])

  const shareButton = (
    <CircleIconButton
      accessibilityLabelI18nKey="productDetail_header_closeButton"
      testID={addTestIdModifier(testID, 'shareButton')}
      iconSource="share-arrow"
      onPress={onShare}
    />
  )
  return (
    <>
      <View testID={addTestIdModifier(testID, 'image_container')} style={styles.imageContainer} onLayout={onLayout}>
        <Animated.View style={headerTransformStyle}>
          <FastImage
            testID={addTestIdModifier(testID, 'image')}
            accessibilityLabel={t('productDetail_header_image')}
            resizeMode={FastImage.resizeMode.contain}
            style={[styles.image, { backgroundColor: colors.secondaryBackground }]}
            source={{ uri: imageUrl }}
          />
          <Animated.View
            style={[styles.overlay, { backgroundColor: colors.secondaryBackground }, overlayOpacityStyle]}
          />
        </Animated.View>
      </View>
      <View testID={addTestIdModifier(testID, 'button_container')} style={styles.headerContainer}>
        <View style={styles.buttonContainer}>
          {shareButtonInHeader || isScreenReaderActive ? shareButton : null}
          <CircleIconButton
            accessibilityLabelI18nKey="productDetail_header_closeButton"
            testID={addTestIdModifier(testID, 'closeButton')}
            iconSource="close"
            onPress={onClose}
          />
        </View>
        {!(shareButtonInHeader || isScreenReaderActive) ? (
          <Animated.View style={[styles.initialShareButton, shareButtonStyle]}>{shareButton}</Animated.View>
        ) : null}
      </View>
    </>
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
    zIndex: 100,
    height: '100%',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 300,
  },
  buttonContainer: {
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing[2],
  },
  initialShareButton: {
    position: 'absolute',
    right: spacing[2],
    top: 75,
  },
})
