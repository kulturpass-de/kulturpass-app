import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormFieldWithControl } from '../../components/form-fields/form-field-with-control'
import { TextFormField } from '../../components/form-fields/text-form-field'
import { PasswordFormField } from '../../components/form-fields/password-form-field'
import { Button } from '../../components/button/button'
import { ScreenContent } from '../../components/screen/screen-content'
import { DateFormField } from '../../components/form-fields/date-form-field'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { CdcStatusValidationError } from '../../services/errors/cdc-errors'
import { ErrorWithCode, UnknownError } from '../../services/errors/errors'
import { DATE_SCHEMA, EMAIL_SCHEMA } from '../../features/form-validation/utils/form-validation'
import { useValidationErrors } from '../../features/form-validation/hooks/use-validation-errors'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'
import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { FormFieldGroup } from '../../components/form-field-group/form-field-group'
import { useUserInfo } from '../../services/user/use-user-info'
import { AccountsGetAccountInfoResponse, AccountsSetAccountInfoSignedRequestParams } from '../../services/api/types'
import { useSetAccountInfo } from '../../services/user/use-set-account-info'

const hasIdVerfiedDayOfBirth = (response?: AccountsGetAccountInfoResponse) => {
  return !!(response?.data?.idVerified === 'true' && response?.data.eid?.dateOfBirth)
}

export type UpdateProfileFormData = {
  // my data
  email: string
  firstName: string
  dateOfBirth: string
  // change password
  password: string
  newPassword: string
  newPasswordConfirmation: string
}

export type UpdateProfileFormDataKeys = keyof UpdateProfileFormData

export type UpdateProfileScreenProps = {
  onHeaderPressClose: () => void
  afterUpdate: () => void
}

export const UpdateProfileScreen: React.FC<UpdateProfileScreenProps> = ({ onHeaderPressClose, afterUpdate }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(
      z
        .object({
          email: EMAIL_SCHEMA(t, true),
          firstName: z.string().optional(),
          dateOfBirth: DATE_SCHEMA(t),
          password: z.string().trim().nonempty().optional(),
          newPassword: z.string().trim().nonempty().optional(),
          newPasswordConfirmation: z.string().trim().nonempty().optional(),
        })
        .refine(data => (!!data.password && data.newPassword === data.newPasswordConfirmation) || !data.password, {
          path: ['newPasswordConfirmation'],
          message: t('form_error_different_from_password'),
        })
        .refine(data => (!!data.newPassword && !!data.password) || !data.newPassword, {
          path: ['password'],
          message: t('form_error_required'),
        }),
    ),
  })

  const { accountInfo } = useUserInfo()
  const setAccountInfo = useSetAccountInfo()
  useEffect(() => {
    if (accountInfo.data?.profile && accountInfo.data?.data) {
      const {
        profile: { firstName, email },
        data,
      } = accountInfo.data

      let dateOfBirth: string | undefined
      if (data.idVerified === 'true' && data.eid) {
        dateOfBirth = data.eid.dateOfBirth
      } else if (data.dateOfBirth) {
        dateOfBirth = data.dateOfBirth
      }

      form.reset({
        email,
        firstName,
        dateOfBirth,
      })
    }
  }, [form, accountInfo.data])

  const { setErrors } = useValidationErrors(form)
  const [visibleError, setVisibleError] = useState<ErrorWithCode>()

  const onSubmit = form.handleSubmit(async data => {
    setLoading(true)
    try {
      const { email, firstName, dateOfBirth, password, newPassword } = data

      const update: AccountsSetAccountInfoSignedRequestParams = {
        profile: {
          email,
          firstName,
        },
      }

      if (dateOfBirth) {
        update.data = {
          dateOfBirth,
        }
      }

      if (password && newPassword) {
        update.password = password
        update.newPassword = newPassword
      }

      await setAccountInfo(update)
      afterUpdate()
    } catch (error: unknown) {
      if (error instanceof CdcStatusValidationError) {
        setErrors(error)
      } else if (error instanceof ErrorWithCode) {
        setVisibleError(error)
      } else {
        setVisibleError(new UnknownError())
      }
    } finally {
      setLoading(false)
    }
  })

  const testID = buildTestId('updateProfile')

  return (
    <>
      <LoadingIndicator loading={accountInfo.isLoading || loading} />
      <Screen
        testID={testID}
        header={
          <ScreenHeader
            title={t('updateProfile_headline')}
            testID={buildTestId('updateProfile_headline')}
            onPressClose={onHeaderPressClose}
            screenType="subscreen"
            borderBottom
          />
        }>
        <ErrorAlert error={visibleError} onDismiss={setVisibleError} />
        <ScreenContent style={styles.screenContent}>
          <FormFieldGroup i18nKey="updateProfile_myData" testID={addTestIdModifier(testID, 'myData')}>
            <FormFieldWithControl
              name={'email'}
              component={TextFormField}
              labelI18nKey="updateProfile_email"
              testID={addTestIdModifier(testID, 'email')}
              control={form.control}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              isRequired
              disabled
            />
            <FormFieldWithControl
              name={'firstName'}
              component={TextFormField}
              labelI18nKey="updateProfile_name"
              testID={addTestIdModifier(testID, 'name')}
              control={form.control}
            />
            <FormFieldWithControl
              name={'dateOfBirth'}
              component={DateFormField}
              labelI18nKey="updateProfile_dateOfBirth"
              testID={addTestIdModifier(testID, 'dateOfBirth')}
              control={form.control}
              disabled={hasIdVerfiedDayOfBirth(accountInfo.data)}
            />
          </FormFieldGroup>
          <FormFieldGroup
            i18nKey="updateProfile_changePassword"
            testID={addTestIdModifier(testID, 'changePassword')}
            containerStyle={styles.passwordGroup}>
            <FormFieldWithControl
              name={'password'}
              component={PasswordFormField}
              labelI18nKey="updateProfile_password"
              testID={addTestIdModifier(testID, 'password')}
              control={form.control}
              isRequired
            />
            <FormFieldWithControl
              name={'newPassword'}
              component={PasswordFormField}
              labelI18nKey="updateProfile_newPassword"
              testID={addTestIdModifier(testID, 'newPassword')}
              control={form.control}
              isRequired
            />
            <FormFieldWithControl
              name={'newPasswordConfirmation'}
              component={PasswordFormField}
              labelI18nKey="updateProfile_newPasswordConfirmation"
              testID={addTestIdModifier(testID, 'newPasswordConfirmation')}
              control={form.control}
              isRequired
            />
          </FormFieldGroup>
        </ScreenContent>
        <View style={styles.submitButtonView}>
          <Button
            disabled={!form.formState.isDirty}
            testID={addTestIdModifier(testID, 'submit')}
            i18nKey="updateProfile_submit"
            onPress={onSubmit}
          />
        </View>
      </Screen>
    </>
  )
}

const styles = StyleSheet.create({
  screenContent: {
    marginTop: spacing[6],
    paddingHorizontal: spacing[5],
  },
  passwordGroup: {
    marginTop: spacing[6],
  },
  submitButtonView: {
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[5],
    borderTopColor: colors.moonDarkest,
    borderTopWidth: 2,
    backgroundColor: colors.basicWhite,
  },
})
