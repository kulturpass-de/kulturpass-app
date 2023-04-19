import React from 'react'
import { Pressable, StyleSheet, type PressableProps } from 'react-native'
import { useAlert } from './alert-context'

export type AlertBackdropProps = PressableProps & { dismissable?: boolean }

export const AlertBackdrop = ({ dismissable, style, ...props }: AlertBackdropProps) => {
  const alertContext = useAlert()
  return (
    <Pressable
      {...props}
      onPress={dismissable ? alertContext?.dismiss : undefined}
      // eslint-disable-next-line react/jsx-no-bind
      style={
        typeof style === 'function'
          ? pressableState => {
              return [styles.container, style(pressableState)]
            }
          : [styles.container, style]
      }
    />
  )
}

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#202325CC', // CC = 70% opacity
  },
})
