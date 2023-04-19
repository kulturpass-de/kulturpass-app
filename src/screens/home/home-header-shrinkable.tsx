import React, { PropsWithChildren, useCallback, useState } from 'react'
import { Animated, LayoutChangeEvent, StyleSheet, View } from 'react-native'

export type HomeHeaderShrinkableProps = {
  offset: Animated.Value
}

export const HomeHeaderShrinkable: React.FC<PropsWithChildren<HomeHeaderShrinkableProps>> = ({ offset, children }) => {
  const [initialHeight, setInitialHeight] = useState<number>(0)

  const height = offset.interpolate({
    inputRange: [0, initialHeight],
    outputRange: [initialHeight, 0],
    extrapolate: 'clamp',
  })

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setInitialHeight(nativeEvent.layout.height)
  }, [])

  return (
    <Animated.View style={[initialHeight !== 0 && { height: height }]}>
      <View style={styles.innerContainer} onLayout={onLayout}>
        {children}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  innerContainer: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    right: 0,
  },
})
