import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, ViewProps } from 'react-native'
import { spacing } from '../../theme/spacing'

export type AlertContainerProps = ViewProps & { visible: boolean }

const FADE_IN_DURATON_IN_MS = 250
const FADE_OUT_DURATON_IN_MS = 100

export const AlertContainer = ({ visible, style, ...props }: AlertContainerProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: FADE_IN_DURATON_IN_MS,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: FADE_OUT_DURATON_IN_MS,
        useNativeDriver: true,
      }).start()
    }
  }, [fadeAnim, visible])

  return <Animated.View {...props} style={[styles.container, style, { opacity: fadeAnim }]} />
}

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[5],
  },
})
