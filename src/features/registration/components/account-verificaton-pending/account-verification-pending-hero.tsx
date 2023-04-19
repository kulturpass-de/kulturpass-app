import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { selectUserProfile } from '../../../../services/user/redux/user-selectors'
import { colors } from '../../../../theme/colors'
import { TranslatedText } from '../../../../components/translated-text/translated-text'
import { Icon } from '../../../../components/icon/icon'
import { Button } from '../../../../components/button/button'
import { cdcApi } from '../../../../services/api/cdc-api'
import { getRegistrationToken } from '../../../../services/auth/store/auth-selectors'
import { ErrorWithCode, UnknownError } from '../../../../services/errors/errors'
import { ErrorAlert } from '../../../form-validation/components/error-alert'
import { spacing } from '../../../../theme/spacing'

export const AccountVerificationHero: React.FC = () => {
  const { buildTestId } = useTestIdBuilder()
  const userData = useSelector(selectUserProfile)
  const regToken = useSelector(getRegistrationToken)
  const [visibleError, setVisibleError] = useState<ErrorWithCode | null>(null)
  const [accountsResendVerificationCode, result] = cdcApi.endpoints.accountsResendVerificationCode.useLazyQuery()

  const onPressResendVerificationCode = useCallback(async () => {
    if (regToken == null) {
      return
    }

    try {
      await accountsResendVerificationCode({ regToken })
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
      <ErrorAlert error={visibleError} onDismiss={setVisibleError} />
      <View style={styles.container}>
        <TranslatedText
          textStyle="HeadlineH4Extrabold"
          textStyleOverrides={{ color: colors.moonDarkest }}
          testID={buildTestId('account_verification_hero_greeting_text')}
          i18nKey={userData ? 'account_verification_hero_greeting' : 'account_verification_hero_greeting_without_name'}
          i18nParams={userData ? { name: userData.firstName } : undefined}
        />
        <View style={styles.content}>
          {result.isSuccess ? (
            <>
              <Icon source="Checkmark" width={36} height={36} />
              <TranslatedText
                textStyleOverrides={styles.text}
                testID={buildTestId('account_verification_description_success_text')}
                i18nKey="account_verification_description_success"
                textStyle="BodySmallMedium"
              />
            </>
          ) : (
            <>
              <Icon source="Coupon" width={36} height={36} />
              <TranslatedText
                textStyleOverrides={styles.text}
                testID={buildTestId('account_verification_description_text')}
                i18nKey="account_verification_description"
                textStyle="BodySmallMedium"
              />
            </>
          )}
        </View>

        <Button
          variant="secondary"
          i18nKey={result.isSuccess ? 'account_verification_resend_disabled' : 'account_verification_resend'}
          testID={buildTestId('account_verification_resend_button')}
          onPress={onPressResendVerificationCode}
          disabled={result.isSuccess}
          modifier="small"
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.sunLighter,
    flexDirection: 'column',
    borderRadius: 16,
    padding: spacing[5],
    overflow: 'hidden',
  },
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
