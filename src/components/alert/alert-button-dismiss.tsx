import React from 'react'
import { StyleSheet } from 'react-native'
import { spacing } from '../../theme/spacing'
import { Button, type ButtonProps } from '../button/button'
import { useAlert } from './alert-context'

export type AlertButtonDismissProps = Omit<ButtonProps, 'testID' | 'i18nKey' | 'onPress' | 'bodyStyleOverrides'> & {
  testID: ButtonProps['testID']
  i18nKey: ButtonProps['i18nKey']
  onPress?: ButtonProps['onPress']
  buttonPadding?: boolean
}

export const AlertButtonDismiss = ({ onPress, buttonPadding = true, ...buttonProps }: AlertButtonDismissProps) => {
  const alertContext = useAlert()

  return (
    <Button
      {...buttonProps}
      // eslint-disable-next-line react/jsx-no-bind
      onPress={alertContext?.dismiss ? () => alertContext.dismiss() : onPress ?? (() => {})}
      bodyStyleOverrides={buttonPadding ? styles.paddingTop : undefined}
    />
  )
}

const styles = StyleSheet.create({
  paddingTop: {
    paddingTop: spacing[2],
  },
})
