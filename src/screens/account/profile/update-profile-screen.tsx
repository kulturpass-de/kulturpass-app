import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Platform, StyleSheet } from 'react-native'
import { z } from 'zod'
import { Button } from '../../../components/button/button'
import { FormFieldGroup } from '../../../components/form-field-group/form-field-group'
import { DateFormField } from '../../../components/form-fields/date-form-field'
import { FormFieldWithControl } from '../../../components/form-fields/form-field-with-control'
import { PasswordFormField } from '../../../components/form-fields/password-form-field'
import { TextFormField } from '../../../components/form-fields/text-form-field'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { Screen } from '../../../components/screen/screen'
import { ScreenContent } from '../../../components/screen/screen-content'
import { ScreenHeader } from '../../../components/screen/screen-header'
import { useFocusErrors } from '../../../features/form-validation/hooks/use-focus-errors'
import { useValidationErrors } from '../../../features/form-validation/hooks/use-validation-errors'
import { DATE_SCHEMA, EMAIL_SCHEMA } from '../../../features/form-validation/utils/form-validation'
import { UpdateProfileAlert } from '../../../features/profile/components/update-profile-alert'
import {
  useNavigationOnBeforeRemove,
  UseNavigationOnBeforeRemoveCallback,
} from '../../../navigation/useNavigationOnBeforeRemove'
import { AccountsGetAccountInfoResponse, AccountsSetAccountInfoSignedRequestParams } from '../../../services/api/types'
import { CdcStatusInvalidParameter, CdcStatusValidationError } from '../../../services/errors/cdc-errors'
import { ErrorAlertManager } from '../../../services/errors/error-alert-provider'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { logger } from '../../../services/logger'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useSetAccountInfo } from '../../../services/user/use-set-account-info'
import { spacing } from '../../../theme/spacing'

type AccountInfoData = Required<Pick<AccountsGetAccountInfoResponse, 'data' | 'profile'>>

const hasIdVerifiedDayOfBirth = (data?: AccountInfoData) => {
  return !!(data?.data?.idVerified === 'true' && data?.data.eid?.dateOfBirth)
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
  accountInfoData: AccountInfoData
  onHeaderPressClose: () => void
  afterUpdate: () => void
}

export const UpdateProfileScreen: React.FC<UpdateProfileScreenProps> = ({
  onHeaderPressClose,
  afterUpdate,
  accountInfoData,
}) => {
  const { t } = useTranslation()
  const [submitLoading, setSubmitLoading] = useState(false)
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const form = useForm<UpdateProfileFormData>({
    shouldFocusError: false,
    resolver: zodResolver(
      z
        .object({
          email: EMAIL_SCHEMA(t, true),
          firstName: z.string().optional(),
          dateOfBirth: DATE_SCHEMA(t),
          password: z.string().trim().min(1).optional(),
          newPassword: z.string().trim().min(1).optional(),
          newPasswordConfirmation: z.string().trim().min(1).optional(),
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
    defaultValues: {
      email: accountInfoData.profile.email,
      firstName: accountInfoData.profile.firstName,
      dateOfBirth:
        accountInfoData.data.idVerified === 'true' && accountInfoData.data.eid
          ? accountInfoData.data.eid.dateOfBirth
          : accountInfoData.data.dateOfBirth || undefined,
    },
  })

  const setAccountInfo = useSetAccountInfo()

  const navigation = useNavigation()
  const [alertVisible, setAlertVisible] = useState(false)

  const isDirty = form.formState.isDirty

  const onClose = useCallback(() => {
    if (isDirty) {
      setAlertVisible(true)
      return
    }
    onHeaderPressClose()
  }, [isDirty, setAlertVisible, onHeaderPressClose])

  const navigationOnBeforeRemoveCallback = useCallback<UseNavigationOnBeforeRemoveCallback>(
    e => {
      if (!isDirty) {
        // If we don't have unsaved changes, then we don't need to do anything
        return
      }

      // Prevent default behavior of leaving the screen
      e.preventDefault()

      // Prompt the user before leaving the screen
      setAlertVisible(true)
    },
    [isDirty, setAlertVisible],
  )

  const { unsubscribeOnBeforeRemoveCallback } = useNavigationOnBeforeRemove(
    navigationOnBeforeRemoveCallback,
    navigation,
  )

  const onDiscardAlert = useCallback(() => {
    setAlertVisible(false)
    form.reset()
    unsubscribeOnBeforeRemoveCallback()
    onHeaderPressClose()
  }, [onHeaderPressClose, setAlertVisible, unsubscribeOnBeforeRemoveCallback, form])

  const onDismissAlert = useCallback(() => {
    setAlertVisible(false)
  }, [setAlertVisible])

  useFocusErrors(form)
  const { setErrors, setError } = useValidationErrors(form)

  const onSubmit = form.handleSubmit(async data => {
    setSubmitLoading(true)
    try {
      const { email, firstName, dateOfBirth, password, newPassword } = data

      const update: AccountsSetAccountInfoSignedRequestParams = {
        profile: {
          email,
          firstName,
        },
        data: {
          dateOfBirth: dateOfBirth || null,
        },
      }

      if (password && newPassword) {
        update.password = password
        update.newPassword = newPassword
      }

      await setAccountInfo(update)
      unsubscribeOnBeforeRemoveCallback()
      afterUpdate()
    } catch (error: unknown) {
      if (error instanceof CdcStatusInvalidParameter) {
        setError({
          errorCode: error.invalidParameter.errorCode,
          fieldName: 'newPassword',
          message: error.invalidParameter.errorDetails,
        })
      } else if (error instanceof CdcStatusValidationError) {
        setErrors(error)
      } else if (error instanceof ErrorWithCode) {
        ErrorAlertManager.current?.showError(error)
      } else {
        logger.warn('update profile error cannot be interpreted', JSON.stringify(error))
        ErrorAlertManager.current?.showError(new UnknownError('Update Profile'))
      }
    } finally {
      setSubmitLoading(false)
    }
  })

  const testID = buildTestId('updateProfile')

  return (
    <>
      <UpdateProfileAlert visible={alertVisible} onDiscard={onDiscardAlert} onDismiss={onDismissAlert} />
      <LoadingIndicator loading={submitLoading || form.formState.isLoading} />
      <Screen
        testID={testID}
        header={
          <ScreenHeader
            title={t('updateProfile_headline')}
            testID={buildTestId('updateProfile_headline')}
            onPressClose={isDirty ? onClose : undefined}
            onPressBack={onClose}
            screenType="subscreen"
          />
        }>
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
              disableAccessibilityForLabel
            />
            <FormFieldWithControl
              name={'firstName'}
              component={TextFormField}
              labelI18nKey="updateProfile_name"
              testID={addTestIdModifier(testID, 'name')}
              control={form.control}
              disableAccessibilityForLabel
            />
            <FormFieldWithControl
              name={'dateOfBirth'}
              component={DateFormField}
              labelI18nKey="updateProfile_dateOfBirth"
              testID={addTestIdModifier(testID, 'dateOfBirth')}
              control={form.control}
              disabled={hasIdVerifiedDayOfBirth(accountInfoData)}
              disableAccessibilityForLabel
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
              disableAccessibilityForLabel
              textContentType="password"
            />
            <FormFieldWithControl
              name={'newPassword'}
              component={PasswordFormField}
              labelI18nKey="updateProfile_newPassword"
              testID={addTestIdModifier(testID, 'newPassword')}
              control={form.control}
              isRequired
              disableAccessibilityForLabel
              textContentType="newPassword"
            />
            <FormFieldWithControl
              name={'newPasswordConfirmation'}
              component={PasswordFormField}
              labelI18nKey="updateProfile_newPasswordConfirmation"
              testID={addTestIdModifier(testID, 'newPasswordConfirmation')}
              control={form.control}
              isRequired
              disableAccessibilityForLabel
              textContentType={Platform.OS === 'ios' ? 'oneTimeCode' : 'newPassword'}
            />
          </FormFieldGroup>
        </ScreenContent>
        <ModalScreenFooter ignorePaddingWithSafeArea={false}>
          <Button
            disabled={!isDirty}
            testID={addTestIdModifier(testID, 'submit')}
            i18nKey="updateProfile_submit"
            onPress={onSubmit}
          />
        </ModalScreenFooter>
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
})
