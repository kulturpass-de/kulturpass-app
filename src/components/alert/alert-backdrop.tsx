import React from 'react'
import { StyleSheet, View } from 'react-native'
import { StatusBar } from 'react-native'
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'
import { useTheme } from '../../theme/hooks/use-theme'
import { useAlert } from './alert-context'

export type AlertBackdropProps = ViewProps &
  React.PropsWithChildren<{
    dismissable?: boolean
  }>

export const AlertBackdrop: React.FC<AlertBackdropProps> = ({ dismissable, style, ...props }) => {
  const { colors } = useTheme()
  const alertContext = useAlert()

  return (
    <>
      <StatusBar backgroundColor={colors.alertBackdrop} translucent />
      <View
        {...props}
        onTouchEnd={dismissable ? alertContext?.dismiss : undefined}
        style={[styles.container, { backgroundColor: colors.alertBackdrop }, style]}
      />
    </>
  )
}

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
})
