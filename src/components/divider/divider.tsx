import React from 'react'
import { StyleSheet, View } from 'react-native'
import { spacing } from '../../theme/spacing'
import { colors } from '../../theme/colors'

export type DividerProps = {
  marginTop?: number
  marginBottom?: number
}

export const Divider: React.FC<DividerProps> = ({ marginTop = spacing[6], marginBottom = spacing[6] }) => {
  return <View style={[styles.divider, { marginTop, marginBottom }]} />
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.moonDarkest10,
  },
})
