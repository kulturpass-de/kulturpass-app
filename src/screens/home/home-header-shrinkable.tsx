import React, { PropsWithChildren, useCallback, useState } from 'react'
import { Animated, Easing, LayoutChangeEvent, Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

export type HomeHeaderShrinkableProps = {
  offset: Animated.Value
  onHeight: (newHeight: number) => void
}

export const HomeHeaderShrinkable: React.FC<PropsWithChildren<HomeHeaderShrinkableProps>> = ({
  offset,
  onHeight,
  children,
}) => {
  const [height, setHeight] = useState<number>(0)

  const translateY = offset.interpolate({
    inputRange: [0, height],
    outputRange: [0, -height],
    easing: Easing.linear,
  })

  const onLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      const roundedHeight = Math.floor(nativeEvent.layout.height)
      setHeight(roundedHeight)
      onHeight(roundedHeight)
    },
    [onHeight],
  )

  const { top } = useSafeAreaInsets()

  return (
    <>
      <Animated.View style={[styles.container, { minHeight: height }, { transform: [{ translateY }] }]}>
        <View style={styles.innerContainer} onLayout={onLayout}>
          {children}
        </View>
      </Animated.View>
      {top > 0 ? <View style={[styles.safeArea, { height: top, transform: [{ translateY: -top }] }]} /> : null}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    overflow: 'hidden',
    zIndex: 10,
  },
  innerContainer: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    right: 0,
    paddingHorizontal: spacing[2],
    marginHorizontal: spacing[2],
    paddingTop: Platform.OS === 'ios' ? spacing[1] : spacing[4],
    backgroundColor: colors.basicBackground,
  },
  safeArea: {
    zIndex: 20,
    backgroundColor: colors.basicBackground,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
})
