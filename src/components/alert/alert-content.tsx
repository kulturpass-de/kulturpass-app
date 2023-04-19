import React from 'react'
import type { PropsWithChildren } from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

export type AlertContentProps = PropsWithChildren<{
  style?: ViewProps['style']
}>

export const AlertContent = ({ style, children }: AlertContentProps) => {
  return <View style={[styles.container, style]}>{children}</View>
}

export const styles = StyleSheet.create({
  container: {
    borderRadius: spacing[5],
    backgroundColor: colors.basicWhite,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[6],

    // https://ethercreative.github.io/react-native-shadow-generator/
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    width: '100%',
    alignItems: 'center',
  },
})
