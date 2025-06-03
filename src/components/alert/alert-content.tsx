import type { PropsWithChildren } from 'react'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

export type AlertContentProps = PropsWithChildren<{
  style?: any
}>

export const AlertContent = React.forwardRef<any, AlertContentProps>(({ style, children }, ref) => {
  const { colors } = useTheme()

  return (
    <View
      style={[styles.wrapper, { backgroundColor: colors.secondaryBackground }, style]}
      ref={ref}
      accessibilityRole="alert">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        {children}
      </ScrollView>
    </View>
  )
})

const styles = StyleSheet.create({
  wrapper: {
    maxHeight: '90%',
    width: '90%',
    alignSelf: 'center',
    borderRadius: spacing[5],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
})
