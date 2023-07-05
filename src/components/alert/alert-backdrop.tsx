import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'
import { colors } from '../../theme/colors'
import { useAlert } from './alert-context'

export type AlertBackdropProps = ViewProps &
  React.PropsWithChildren<{
    dismissable?: boolean
  }>

export const AlertBackdrop: React.FC<AlertBackdropProps> = ({ dismissable, style, ...props }) => {
  const alertContext = useAlert()

  return (
    <View {...props} onTouchEnd={dismissable ? alertContext?.dismiss : undefined} style={[styles.container, style]} />
  )
}

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.transparentMoonDarker80,
  },
})
