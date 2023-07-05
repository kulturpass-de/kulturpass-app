import React from 'react'
import { Button, Text } from 'react-native'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../services/test-id/test-id'

export type LogOutScreenProps = {
  onPressOkButton: () => void
}

export const LogOutScreen: React.FC<LogOutScreenProps> = ({ onPressOkButton }) => {
  const { buildTestId } = useTestIdBuilder()
  return (
    <ModalScreen testID={buildTestId('logout')}>
      <TranslatedText
        i18nKey="logout_success_message"
        testID={buildTestId('logout_success_message')}
        textStyle="BodyRegular"
      />
      <Text>{'You have succesfully logged out!'}</Text>
      <Button title="Ok" onPress={onPressOkButton} />
    </ModalScreen>
  )
}
