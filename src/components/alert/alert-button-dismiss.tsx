import React from 'react'
import { Button, type ButtonProps } from '../button/button'
import { useAlert } from './alert-context'

export type AlertButtonDismissProps = Omit<ButtonProps, 'testID' | 'i18nKey' | 'onPress'> & {
  testID: ButtonProps['testID']
  i18nKey: ButtonProps['i18nKey']
  onPress?: ButtonProps['onPress']
}

export const AlertButtonDismiss = ({ onPress, ...buttonProps }: AlertButtonDismissProps) => {
  const alertContext = useAlert()

  return (
    <Button
      {...buttonProps}
      // eslint-disable-next-line react/jsx-no-bind
      onPress={alertContext?.dismiss ? () => alertContext.dismiss() : onPress ?? (() => {})}
    />
  )
}
