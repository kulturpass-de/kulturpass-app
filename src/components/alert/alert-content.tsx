import type { PropsWithChildren } from 'react'
import React, { useCallback, useState } from 'react'
import { LayoutChangeEvent, ScrollView, StyleSheet, View, type ViewProps } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

export type AlertContentProps = PropsWithChildren<{
  style?: ViewProps['style']
}>

export const AlertContent = React.forwardRef<any, AlertContentProps>(({ style, children }, ref) => {
  const [contentHeight, setContentHeight] = useState(0)

  const onLayout = useCallback((evt: LayoutChangeEvent) => {
    /**
     * It's not possible to center a ScrollView vertically,
     * without knowing how much height the content consumes
     * So we calculate once the height with a <View />
     * to pass it to the ScrollView in the next render
     */
    setContentHeight(evt.nativeEvent.layout.height)
  }, [])

  if (contentHeight === 0) {
    return (
      <View ref={ref} accessibilityRole="alert" onLayout={onLayout} style={[styles.container, styles.content, style]}>
        {children}
      </View>
    )
  }

  return (
    <ScrollView
      ref={ref}
      accessibilityRole="alert"
      style={[styles.container, { maxHeight: contentHeight }]}
      contentContainerStyle={[styles.content, style]}>
      {children}
    </ScrollView>
  )
})

export const styles = StyleSheet.create({
  container: {
    borderRadius: spacing[5],
    backgroundColor: colors.basicWhite,

    // https://ethercreative.github.io/react-native-shadow-generator/
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[6],
  },
})
