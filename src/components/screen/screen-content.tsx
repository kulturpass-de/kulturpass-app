import React from 'react'
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native'

export type ScreenContentProps = React.PropsWithChildren<{
  style?: ViewStyle
}>

export const ScreenContent: React.FC<ScreenContentProps> = ({ style, children }) => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainerStyle} keyboardShouldPersistTaps="handled">
      {/**
       * We don't want to apply style prop on ScrollView, as `padding` would break it, so we apply style prop on a
       * separate View
       */}
      <View style={[styles.innerContainerStyle, style]}>{children}</View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
  innerContainerStyle: {
    flexGrow: 1,
  },
})
