import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { spacing } from '../../theme/spacing'

export type AlertContainerProps = ViewProps

export const AlertContainer = ({ style, ...props }: AlertContainerProps) => {
  return <View {...props} style={[styles.container, style]} />
}

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
  },
})
