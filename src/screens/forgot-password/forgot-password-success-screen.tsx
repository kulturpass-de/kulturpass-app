import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from '../../components/button/button'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../components/screen/screen-content'
import { SvgImage } from '../../components/svg-image/svg-image'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

export type ForgotPasswordSuccessScreenProps = {
  onHeaderPressClose: () => void
  onToLogin: () => void
}
export const ForgotPasswordSuccessScreen: React.FC<ForgotPasswordSuccessScreenProps> = props => {
  const { buildTestId } = useTestIdBuilder()
  const { onHeaderPressClose, onToLogin } = props

  return (
    <ModalScreen whiteBottom testID={buildTestId('forgotPasswordSuccess')}>
      <ModalScreenHeader
        titleI18nKey="forgotPasswordSuccess_headline"
        testID={buildTestId('forgotPasswordSuccess_headline')}
        onPressClose={onHeaderPressClose}
      />
      <ScreenContent style={styles.screenContent}>
        <SvgImage
          screenWidthRelativeSize={0.95}
          height={150}
          testID={buildTestId('forgotPasswordSuccess_image_alt')}
          i18nKey="forgotPasswordSuccess_image_alt"
          type="password"
        />
        <TranslatedText
          textStyle="BodyRegular"
          textStyleOverrides={styles.description}
          i18nKey="forgotPasswordSuccess_copytext"
          testID={buildTestId('forgotPasswordSuccess_copytext')}
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
    paddingHorizontal: spacing[5],
    flex: 1,
  },
  description: {
    marginBottom: spacing[6],
    textAlign: 'center',
    color: colors.primaryDark,
  },
})
