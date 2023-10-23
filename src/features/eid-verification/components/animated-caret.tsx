import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export const AnimatedCaret = () => {
  const fadeAim = useRef(new Animated.Value(0)).current
  const { colors } = useTheme()

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(500),
        Animated.timing(fadeAim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.delay(500),
        Animated.timing(fadeAim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }),
      ]),
    ).start()
  }, [fadeAim])

  return (
    <Animated.View style={[styles.caretContainer, { opacity: fadeAim }]}>
      <View style={[styles.caret, { borderLeftColor: colors.textFieldBorderFocused }]} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  caretContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caret: {
    borderLeftWidth: spacing[0],
    width: spacing[6],
    height: spacing[6],
  },
})
