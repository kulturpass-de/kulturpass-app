import React from 'react'
import { StyleSheet } from 'react-native'
import { Alert } from '../../components/alert/alert'
import { AlertContent } from '../../components/alert/alert-content'
import { AlertTitle } from '../../components/alert/alert-title'
import { Button } from '../../components/button/button'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { AvailableTranslations } from '../translated-text/types'

export type CancelConfirmAlertProps = {
  visible: boolean
  onDismiss: () => void
  onConfirmCancelation: () => void
  testID: TestId
  i18nKeyTitle: AvailableTranslations
  i18nKeyText: AvailableTranslations
  i18nKeyConfirmButton: AvailableTranslations
  i18nKeyDismissButton: AvailableTranslations
}

export const CancelConfirmAlert: React.FC<CancelConfirmAlertProps> = ({
  visible,
  onDismiss,
  onConfirmCancelation,
  testID,
  ...i18n
}) => {
  const { addTestIdModifier } = useTestIdBuilder()

  return (
    <Alert visible={visible}>
      <AlertContent style={styles.container}>
        <AlertTitle testID={addTestIdModifier(testID, 'title')} i18nKey={i18n.i18nKeyTitle} />
        <TranslatedText
          textStyleOverrides={styles.text}
          testID={addTestIdModifier(testID, 'text')}
          i18nKey={i18n.i18nKeyText}
          textStyle="BodyRegular"
        />
        <Button
          testID={addTestIdModifier(testID, 'dismiss_button')}
          i18nKey={i18n.i18nKeyDismissButton}
          variant="primary"
          onPress={onDismiss}
        />
        <Button
          testID={addTestIdModifier(testID, 'confirm_button')}
          i18nKey={i18n.i18nKeyConfirmButton}
          variant="white"
          onPress={onConfirmCancelation}
        />
      </AlertContent>
    </Alert>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    textAlign: 'center',
  },
  text: {
    flexWrap: 'wrap',
    textAlign: 'center',
    marginBottom: spacing[6],
    color: colors.moonDarker,
  },
})
