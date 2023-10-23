import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

export type DividerProps = {
  marginTop?: number
  marginBottom?: number
  style?: StyleProp<ViewStyle>
}

export const Divider: React.FC<DividerProps> = ({ marginTop = spacing[6], marginBottom = spacing[6], style }) => {
  const { colors } = useTheme()
  return <View style={[styles.divider, { borderTopColor: colors.divider }, { marginTop, marginBottom }, style]} />
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    borderTopWidth: 1,
  },
})
