import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { colors } from '../../../../theme/colors'
import { TranslatedText } from '../../../../components/translated-text/translated-text'
import { Icon } from '../../../../components/icon/icon'
import { Button } from '../../../../components/button/button'
import { cdcApi } from '../../../../services/api/cdc-api'
import { getIsUserLoggedIn, getRegistrationToken } from '../../../../services/auth/store/auth-selectors'
import { ErrorWithCode, UnknownError } from '../../../../services/errors/errors'
import { ErrorAlert } from '../../../form-validation/components/error-alert'
import { spacing } from '../../../../theme/spacing'
import { LoadingIndicator } from '../../../../components/loading-indicator/loading-indicator'
import { useUserInfo } from '../../../../services/user/use-user-info'
import { InfoBox } from '../../../../components/info-box/info-box'

const RESEND_MAIL_VERIFICATION_AFTER_1MIN = 1000 * 60

export const AccountVerificationHero: React.FC = () => {
  const { buildTestId } = useTestIdBuilder()
  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const { firstName } = useUserInfo()
  const regToken = useSelector(getRegistrationToken)
  const [visibleError, setVisibleError] = useState<ErrorWithCode>()
  const timerRef = useRef<NodeJS.Timeout>()
  const [canResend, setCanResend] = useState(true)
  const [accountsResendVerificationCode, result] = cdcApi.endpoints.accountsResendVerificationCode.useLazyQuery()

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [])

  const onPressResendVerificationCode = useCallback(async () => {
    if (regToken == null) {
      return
    }

    try {
      await accountsResendVerificationCode({ regToken })
      setCanResend(false)
      timerRef.current = setTimeout(() => setCanResend(true), RESEND_MAIL_VERIFICATION_AFTER_1MIN)
    } catch (error: unknown) {
      if (error instanceof ErrorWithCode) {
        setVisibleError(error)
      } else {
        setVisibleError(new UnknownError())
      }
    }
  }, [accountsResendVerificationCode, regToken])

  return (
    <>
      <LoadingIndicator loading={result.isLoading} />
      <ErrorAlert error={visibleError} onDismiss={setVisibleError} />
      <InfoBox focusable>
        <TranslatedText
          textStyle="HeadlineH4Extrabold"
          textStyleOverrides={{ color: colors.moonDarkest }}
          testID={buildTestId('account_verification_hero_greeting_text')}
          i18nKey={firstName ? 'account_verification_hero_greeting' : 'account_verification_hero_greeting_without_name'}
          i18nParams={isLoggedIn ? { name: firstName } : undefined}
        />
        <View style={styles.content}>
          {canResend ? (
            <>
              <Icon source="Mail" width={36} height={36} />
              <TranslatedText
                textStyleOverrides={styles.text}
                testID={buildTestId('account_verification_description_text')}
                i18nKey="account_verification_description"
                textStyle="BodySmallMedium"
              />
            </>
          ) : (
            <>
              <Icon source="Checkmark" width={36} height={36} />
              <TranslatedText
                textStyleOverrides={styles.text}
                testID={buildTestId('account_verification_description_success_text')}
                i18nKey="account_verification_description_success"
                textStyle="BodySmallMedium"
              />
            </>
          )}
        </View>

        <Button
          variant="secondary"
          i18nKey={canResend ? 'account_verification_resend' : 'account_verification_resend_disabled'}
          testID={buildTestId('account_verification_resend_button')}
          onPress={onPressResendVerificationCode}
          disabled={!canResend}
          modifier="small"
        />
      </InfoBox>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    marginTop: spacing[2],
    marginBottom: spacing[5],
    flexDirection: 'row',
    flexShrink: 1,
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: spacing[2],
    color: colors.moonDarkest,
  },
})
