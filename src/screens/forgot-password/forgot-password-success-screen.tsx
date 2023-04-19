import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ScreenContent } from '../../components/screen/screen-content'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../components/translated-text/translated-text'

import { useTestIdBuilder } from '../../services/test-id/test-id'
import { spacing } from '../../theme/spacing'
import { Button } from '../../components/button/button'
import { colors } from '../../theme/colors'
import { SvgImage } from '../../components/svg-image/svg-image'

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
          testID={buildTestId('forgotPasswordSuccess_image')}
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
      <View style={styles.buttonView}>
        <Button
          testID={buildTestId('forgotPasswordSuccess_toLogin_button')}
          i18nKey="forgotPasswordSuccess_toLogin_button"
          onPress={onToLogin}
        />
      </View>
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
  buttonView: {
    padding: spacing[5],
    borderTopColor: colors.moonDarkest,
    borderTopWidth: 2,
    backgroundColor: colors.basicWhite,
  },
})
