import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

export type DividerProps = {
  marginTop?: number
  marginBottom?: number
  style?: StyleProp<ViewStyle>
}

export const Divider: React.FC<DividerProps> = ({ marginTop = spacing[6], marginBottom = spacing[6], style }) => {
  return <View style={[styles.divider, { marginTop, marginBottom }, style]} />
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.moonDarkest10,
  },
})
