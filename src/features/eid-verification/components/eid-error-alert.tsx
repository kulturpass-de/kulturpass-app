import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Alert } from '../../../components/alert/alert'
import { AlertContent } from '../../../components/alert/alert-content'
import { AlertTitle } from '../../../components/alert/alert-title'
import { Button } from '../../../components/button/button'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import useAccessibilityFocus from '../../../navigation/a11y/use-accessibility-focus'
import { RootStackParams } from '../../../navigation/types'
import { ErrorWithCode } from '../../../services/errors/errors'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import {
  AA2AcceptTimeout,
  AA2BelowMinAge,
  AA2BelowMinYearOfBirth,
  AA2CardAuthenticityValidationFailed,
  AA2CardDeactivated,
  AA2CardRemoved,
  AA2CardValidationFailed,
  AA2ForeignResidency,
  AA2InitError,
  AA2PseudonymAlreadyInUse,
  AA2SetPinTimeout,
  AA2Timeout,
} from '../errors'
import { useCloseFlow } from '../hooks/use-close-flow'
import { useHandleErrors } from '../hooks/use-handle-errors'
import { eidAusweisApp2Service } from '../services/eid-ausweisapp2-service'

export type EidErrorAlertProps = {
  error: ErrorWithCode | null
  onModalIsVisible?: (isVisible: boolean) => void
  cancelEidFlowAlertVisible?: boolean
  handleUserCancellation?: boolean
}

export const EidErrorAlert: React.FC<EidErrorAlertProps> = ({
  error,
  onModalIsVisible,
  cancelEidFlowAlertVisible = false,
  handleUserCancellation = false,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const testID = buildTestId('eid_error_alert')
  const { colors } = useTheme()
  const { t } = useTranslation()
  const [textStyles] = useTextStyles()

  const navigation = useNavigation<StackNavigationProp<RootStackParams>>()

  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  const [intError, setIntError] = useState<ErrorWithCode | null>(null)

  useHandleErrors(setIntError, handleUserCancellation, cancelEidFlowAlertVisible)

  const { closeFlow } = useCloseFlow()

  useEffect(() => {
    if (error !== null) {
      setIntError(error)
    }
  }, [error])

  useEffect(() => {
    if (onModalIsVisible !== undefined) {
      onModalIsVisible(intError !== null)
    }
  }, [intError, onModalIsVisible])

  const handleRestart = useCallback(async () => {
    await eidAusweisApp2Service.stopSDK()
    navigation.replace('Eid')
    setIntError(null)
  }, [navigation])

  const handleClose = useCallback(async () => {
    await closeFlow()
    setIntError(null)
  }, [closeFlow])

  const errorMessage: string | undefined = useMemo(() => {
    if (intError instanceof AA2InitError) {
      return t('eid_error_init_message')
    } else if (intError instanceof AA2BelowMinYearOfBirth) {
      return t('eid_error_belowMinYearOfBirth_message')
    } else if (intError instanceof AA2BelowMinAge) {
      return t('eid_error_belowMinAge_message')
    } else if (intError instanceof AA2ForeignResidency) {
      return t('eid_error_foreignResidency_message')
    } else if (intError instanceof AA2PseudonymAlreadyInUse) {
      return t('eid_error_pseudonymAlreadyInUse_message')
    } else if (intError instanceof AA2CardDeactivated) {
      return t('eid_error_cardDeactivated_message')
    } else if (intError instanceof AA2Timeout) {
      return t('eid_error_timeout_message')
    } else if (intError instanceof AA2CardRemoved) {
      return t('eid_error_cardRemoved_message')
    } else if (intError instanceof AA2CardValidationFailed) {
      return t('eid_error_cardValidationFailed_message')
    } else if (intError instanceof AA2CardAuthenticityValidationFailed) {
      return t('eid_error_cardAuthenticityValidationFailed_message')
    } else if (intError instanceof AA2AcceptTimeout) {
      return t('eid_error_acceptTimeout_message')
    } else if (intError instanceof AA2SetPinTimeout) {
      return t('eid_error_setPinTimeout_message')
    }
  }, [intError, t])

  const errorCode: string | undefined = useMemo(() => {
    if (intError === null) {
      return
    } else if (!intError.detailCode) {
      return intError.errorCode
    } else {
      return `${intError.errorCode} - ${intError.detailCode}`
    }
  }, [intError])

  return (
    <Alert visible={intError !== null} dismissable={false}>
      <AlertContent ref={focusRef}>
        <AlertTitle i18nKey="eid_error_title" testID={addTestIdModifier(testID, 'title')} />
        <TranslatedText
          textStyle="BodyRegular"
          i18nKey="error_alert_message_fallback"
          testID={addTestIdModifier(testID, 'message')}
          textStyleOverrides={{ color: colors.labelColor }}
        />
        <View style={styles.content}>
          {errorMessage ? (
            <Text
              style={[textStyles.BodyRegular, styles.message, { color: colors.labelColor }]}
              testID={addTestIdModifier(testID, 'message_detail')}>
              {errorMessage}
            </Text>
          ) : (
            <TranslatedText
              i18nKey="eid_error_try_again_message"
              testID={addTestIdModifier(testID, 'try_again_message')}
              textStyle="BodyRegular"
              textStyleOverrides={[styles.message, { color: colors.labelColor }]}
            />
          )}
          <Text
            style={[textStyles.BodyRegular, styles.message, { color: colors.labelColor }]}
            testID={addTestIdModifier(testID, 'code')}>
            {errorCode}
          </Text>

          {intError?.errorDetails ? (
            <Text
              style={[textStyles.BodyRegular, styles.message, { color: colors.labelColor }]}
              testID={addTestIdModifier(testID, 'details')}>
              {intError.errorDetails}
            </Text>
          ) : null}
        </View>
        <Button
          widthOption="stretch"
          variant="primary"
          i18nKey="eid_error_retry_button"
          testID={addTestIdModifier(testID, 'retry_button')}
          onPress={handleRestart}
        />
        <Button
          widthOption="stretch"
          variant="transparent"
          i18nKey="alert_cta"
          onPress={handleClose}
          testID={addTestIdModifier(testID, 'cta')}
        />
      </AlertContent>
    </Alert>
  )
}

const styles = StyleSheet.create({
  message: {
    textAlign: 'center',
  },
  content: {
    marginBottom: spacing[6],
    gap: spacing[4],
  },
})
