import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../../components/screen/screen-content'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export type ForgotPasswordSuccessScreenProps = {
  onHeaderPressClose: () => void
  onToLogin: () => void
}
export const ForgotPasswordSuccessScreen: React.FC<ForgotPasswordSuccessScreenProps> = props => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  const { onHeaderPressClose, onToLogin } = props

  return (
    <ModalScreen whiteBottom testID={buildTestId('forgotPasswordSuccess')}>
      <ModalScreenHeader
        titleI18nKey="forgotPasswordSuccess_headline"
        testID={buildTestId('forgotPasswordSuccess_headline')}
        onPressClose={onHeaderPressClose}
      />
      <ScreenContent style={styles.screenContent}>
        <Illustration
          testID={buildTestId('forgotPasswordSuccess_image_alt')}
          i18nKey="forgotPasswordSuccess_image_alt"
          type="password"
          style={styles.image}
        />
        <TranslatedText
          textStyle="BodyRegular"
          textStyleOverrides={[styles.description, { color: colors.labelColor }]}
          i18nKey="forgotPasswordSuccess_copytext"
          testID={buildTestId('forgotPasswordSuccess_copytext')}
        />
        <TranslatedText
          textStyle="BodyRegular"
          textStyleOverrides={[styles.description, { color: colors.labelColor }]}
          i18nKey="forgotPasswordSuccess_check_spam"
          testID={buildTestId('forgotPasswordSuccess_check_spam')}
        />
      </ScreenContent>
      <ModalScreenFooter>
        <Button
          testID={buildTestId('forgotPasswordSuccess_toLogin_button')}
          i18nKey="forgotPasswordSuccess_toLogin_button"
          onPress={onToLogin}
        />
      </ModalScreenFooter>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 0,
  },
  image: {
    paddingBottom: spacing[6],
  },
  description: {
    paddingBottom: spacing[6],
    paddingHorizontal: spacing[5],
    textAlign: 'center',
  },
})
