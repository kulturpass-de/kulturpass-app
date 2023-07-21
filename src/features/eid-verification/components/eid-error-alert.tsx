import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Alert } from '../../../components/alert/alert'
import { AlertContent } from '../../../components/alert/alert-content'
import { AlertTitle } from '../../../components/alert/alert-title'
import { Button } from '../../../components/button/button'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import useAccessibilityFocus from '../../../navigation/a11y/use-accessibility-focus'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ErrorWithCode } from '../../../services/errors/errors'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import {
  AA2AcceptTimeout,
  AA2BelowMinAge,
  AA2BelowMinYearOfBirth,
  AA2CardDeactivated,
  AA2CardRemoved,
  AA2ForeignResidency,
  AA2InitError,
  AA2PseudonymAlreadyInUse,
  AA2Timeout,
} from '../errors'
import { useCancelFlow } from '../hooks/use-cancel-flow'
import { useHandleErrors } from '../hooks/use-handle-errors'
import { EidAboutVerificationRouteName } from '../screens/eid-about-verification-route'

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
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()
  const { t } = useTranslation()

  const modalNavigation = useModalNavigation()
  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  const [intError, setIntError] = useState<ErrorWithCode | null>(null)

  useHandleErrors(setIntError, handleUserCancellation, cancelEidFlowAlertVisible)

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

  const cancelFlow = useCancelFlow()

  const handleRestart = useCallback(async () => {
    await cancelFlow()
    modalNavigation.replace({
      screen: EidAboutVerificationRouteName,
    })
    setIntError(null)
  }, [cancelFlow, modalNavigation])

  const handleClose = useCallback(async () => {
    await cancelFlow()
    modalNavigation.closeModal()
    setIntError(null)
  }, [cancelFlow, modalNavigation])

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
    } else if (intError instanceof AA2AcceptTimeout) {
      return t('eid_error_acceptTimeout_message')
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
        <AlertTitle i18nKey="eid_error_title" testID={buildTestId('eid_error_title')} />
        <TranslatedText
          textStyle="BodyRegular"
          i18nKey="error_alert_message_fallback"
          testID={buildTestId('error_alert_message')}
          textStyleOverrides={{ color: colors.labelColor }}
        />
        <View style={styles.content}>
          {errorMessage ? (
            <Text
              style={[textStyles.BodyRegular, styles.message, { color: colors.labelColor }]}
              testID={buildTestId('error_alert_message_detail')}>
              {errorMessage}
            </Text>
          ) : (
            <TranslatedText
              i18nKey="eid_error_try_again_message"
              textStyle="BodyRegular"
              textStyleOverrides={[styles.message, { color: colors.labelColor }]}
            />
          )}
          <Text
            style={[textStyles.BodyRegular, styles.message, { color: colors.labelColor }]}
            testID={buildTestId('error_alert_code')}>
            {errorCode}
          </Text>

          {intError?.errorDetails ? (
            <Text
              style={[textStyles.BodyRegular, styles.message, { color: colors.labelColor }]}
              testID={buildTestId('error_alert_details')}>
              {intError.errorDetails}
            </Text>
          ) : null}
        </View>
        <Button
          widthOption="stretch"
          variant="primary"
          i18nKey="eid_error_retry_button"
          testID={buildTestId('eid_error_retry_button')}
          onPress={handleRestart}
        />
        <Button
          widthOption="stretch"
          variant="transparent"
          i18nKey="alert_cta"
          onPress={handleClose}
          testID={buildTestId('alert_cta')}
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
