import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import { useEffect, useState } from 'react'
import { Animated, Platform } from 'react-native'
import { ModalParamList } from '../../../navigation/modal/types'
import { UseProductDetailHeaderHeightReturnType } from '../hooks/use-product-detail-header-height'

export type UseDismissSwipingDownProps = {
  productDetailHeaderHeightProps: UseProductDetailHeaderHeightReturnType
  scrollY: Animated.Value
}

export const useDismissSwipingDown = ({ productDetailHeaderHeightProps, scrollY }: UseDismissSwipingDownProps) => {
  const [isGestureEnabled, setIsGestureDismissEnableOnProductImageHeader] = useState<boolean>(Platform.OS === 'ios')

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      // The swipe down dismiss feature is only available on iOS
      return
    }

    const id = scrollY.addListener(event => {
      const enableGestureWhenScrollPositionIsOnInitialPosition = event.value <= 0
      setIsGestureDismissEnableOnProductImageHeader(enableGestureWhenScrollPositionIsOnInitialPosition)
    })
    return () => scrollY.removeListener(id)
  }, [scrollY])

  const navigation = useNavigation<StackNavigationProp<ModalParamList, 'ProductDetail'>>()
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      // The swipe down dismiss feature is only available on iOS
      return
    }

    const modalStackNavigation = navigation.getParent<StackNavigationProp<ModalParamList>>()
    const gestureResponseDistance = isGestureEnabled
      ? (productDetailHeaderHeightProps.headerMaxHeight ?? 0) + productDetailHeaderHeightProps.headerMinHeight
      : productDetailHeaderHeightProps.headerMinHeight

    modalStackNavigation?.setOptions({
      gestureResponseDistance,
    })
  }, [navigation, isGestureEnabled, productDetailHeaderHeightProps])

  return {
    isEnabled: isGestureEnabled,
    containerStyle: {
      paddingTop: isGestureEnabled
        ? productDetailHeaderHeightProps.headerMaxHeight ?? 0 + productDetailHeaderHeightProps.headerMinHeight
        : productDetailHeaderHeightProps.headerMinHeight,
    },
  }
}
