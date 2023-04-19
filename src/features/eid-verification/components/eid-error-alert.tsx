import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert } from '../../../components/alert/alert'
import { AlertContent } from '../../../components/alert/alert-content'
import { AlertTitle } from '../../../components/alert/alert-title'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { ErrorWithCode } from '../../../services/errors/errors'
import { useHandleErrors } from '../hooks/use-handle-errors'
import { StyleSheet, Text } from 'react-native'
import { textStyles } from '../../../theme/typography'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { useCancelFlow } from '../hooks/use-cancel-flow'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { EidAboutVerificationRouteName } from '../screens/eid-about-verification-route'
import { Button } from '../../../components/button/button'
import { TranslatedText } from '../../../components/translated-text/translated-text'

export type EidErrorAlertProps = {
  error: ErrorWithCode | null
}

export const EidErrorAlert: React.FC<EidErrorAlertProps> = ({ error }) => {
  const { buildTestId } = useTestIdBuilder()
  const modalNavigation = useModalNavigation()

  const [intError, setIntError] = useState<ErrorWithCode | null>(null)

  useHandleErrors(setIntError)

  useEffect(() => {
    if (error !== null) {
      setIntError(error)
    }
  }, [error])

  const cancelFlow = useCancelFlow()

  const handleRestart = useCallback(async () => {
    await cancelFlow()
    modalNavigation.reset({
      index: 0,
      routes: [
        {
          name: 'Modal',
          state: {
            routes: [{ name: EidAboutVerificationRouteName }],
          },
        },
      ],
    })
    setIntError(null)
  }, [cancelFlow, modalNavigation])

  const handleClose = useCallback(async () => {
    await cancelFlow()
    modalNavigation.closeModal()
    setIntError(null)
  }, [cancelFlow, modalNavigation])

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
      <AlertContent>
        <AlertTitle i18nKey="eid_error_title" testID={buildTestId('eid_error_title')} />
        <TranslatedText
          textStyle="BodyRegular"
          i18nKey="error_alert_message_fallback"
          testID={buildTestId('error_alert_message')}
        />
        <Text style={[textStyles.BodyRegular, styles.errorCode]} testID={buildTestId('error_alert_code')}>
          {errorCode}
        </Text>
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
  errorCode: {
    marginBottom: spacing[6],
    color: colors.moonDarker,
  },
})
