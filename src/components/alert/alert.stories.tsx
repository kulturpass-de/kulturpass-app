import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import { Alert } from './alert'
import { AlertContent } from './alert-content'
import { AlertTitle } from './alert-title'
import { AlertMessage } from './alert-message'
import { AlertButtonDismiss } from './alert-button-dismiss'
import { useTestIdBuilder } from '../../services/test-id/test-id'

const componentMeta: ComponentMeta<typeof Alert> = {
  title: 'Alert',
  component: Alert,
}

export default componentMeta

export const Error: ComponentStory<typeof Alert> = () => {
  const [visible, setVisible] = useState<boolean>(true)
  const { buildTestId } = useTestIdBuilder()
  return (
    <Alert visible={visible} onChange={setVisible}>
      <AlertContent>
        <AlertTitle testID={buildTestId('login_error_title')} i18nKey="login_error_title" />
        <AlertMessage testID={buildTestId('login_error_message')} i18nKey="login_error_message" />
        <AlertButtonDismiss testID={buildTestId('login_error_dismiss_button')} i18nKey="alert_cta" />
      </AlertContent>
    </Alert>
  )
}
