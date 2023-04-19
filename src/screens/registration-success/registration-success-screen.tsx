import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Button } from '../../components/button/button'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ScreenContent } from '../../components/screen/screen-content'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { Illustration } from '../../components/illustration/illustration'

export type RegistrationSuccessScreenProps = {
  onConfirmation: () => void
}

export const RegistrationSuccessScreen: React.FC<RegistrationSuccessScreenProps> = ({ onConfirmation }) => {
  const { buildTestId } = useTestIdBuilder()

  return (
    <ModalScreen whiteBottom testID={buildTestId('registration_success')}>
      <ModalScreenHeader
        titleI18nKey="registration_success_headline"
        testID={buildTestId('registration_success_headline')}
        onPressClose={onConfirmation}
      />
      <View style={styles.imageContainer}>
        <Illustration
          testID={buildTestId('registration_success_image')}
          i18nKey="registration_success_image_alt"
          type="verify-mail"
        />
      </View>
      <ScreenContent style={styles.textContainer}>
        <TranslatedText
          textStyle="HeadlineH3Extrabold"
          textStyleOverrides={styles.textHero}
          i18nKey="registration_success_hero_text"
          testID={buildTestId('registration_success_hero_text')}
        />
        <TranslatedText
          textStyle="BodyRegular"
          textStyleOverrides={styles.textTodoInformation}
          i18nKey="registration_success_todo_information"
          testID={buildTestId('registration_success_todo_information')}
        />
      </ScreenContent>
      <View style={styles.buttonContainer}>
        <Button
          testID={buildTestId('registration_success_button')}
          i18nKey="registration_success_button"
          onPress={onConfirmation}
        />
      </View>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    left: 0,
    right: 0,
    top: 0,
  },
  textContainer: {
    flexGrow: 1,
    alignItems: 'flex-start',
    paddingHorizontal: spacing[5],
  },
  textHero: {
    alignSelf: 'center',
    marginVertical: spacing[6],
    color: colors.basicBlack,
  },
  textTodoInformation: {
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: spacing[6],
    color: colors.moonDarkest,
  },
  buttonContainer: {
    paddingTop: spacing[5],
    paddingHorizontal: spacing[5],
    borderTopColor: colors.moonDarkest,
    borderTopWidth: 2,
    backgroundColor: colors.basicWhite,
  },
})
