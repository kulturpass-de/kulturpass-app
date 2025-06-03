import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { Screen } from '../../../components/screen/screen'
import { ScreenHeader } from '../../../components/screen/screen-header'
import { Preferences } from '../../../features/preferences/components/preferences'
import { useAndroidBackButtonHandler } from '../../../features/preferences/hooks/use-android-back-button-handler'
import { usePreferences } from '../../../features/preferences/hooks/use-preferences'
import { isPreferencesFormDirty } from '../../../features/preferences/utils/is-preferences-form-dirty'
import { sanitizeSelectedCategories } from '../../../features/preferences/utils/sanitize-selected-categories'
import { UpdateProfileAlert } from '../../../features/profile/components/update-profile-alert'
import {
  useNavigationOnBeforeRemove,
  UseNavigationOnBeforeRemoveCallback,
} from '../../../navigation/useNavigationOnBeforeRemove'
import { commerceApi } from '../../../services/api/commerce-api'
import { AccountInfoData, AccountsSetAccountInfoSignedRequestParams } from '../../../services/api/types'
import { ErrorAlertManager } from '../../../services/errors/error-alert-provider'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { logger } from '../../../services/logger'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useUserInfo } from '../../../services/user/use-user-info'

export type PreferencesScreenProps = {
  afterSubmitTriggered: () => void
  onPressClose: () => void
  onPressEmailInfo?: () => void
}

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({
  afterSubmitTriggered,
  onPressClose,
  onPressEmailInfo,
}) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()
  const preferenceCategories = commerceApi.useGetPreferenceCategoriesQuery()
  const { setAccountInfo, accountInfo } = useUserInfo()
  const [getIsValidPostalCode] = commerceApi.useLazyGetIsValidPostalCodeQuery()
  const availableCategories = preferenceCategories.data?.categories
  const userPreferences = accountInfo.data?.data
  const cdcValueIsSubscribed = accountInfo.data?.subscriptions?.editorialInformation?.email?.isSubscribed
  const [userValueIsSubscribed, setUserValueIsSubscribed] = useState<undefined | boolean>()

  useEffect(() => {
    if (userValueIsSubscribed === undefined && cdcValueIsSubscribed !== undefined) {
      setUserValueIsSubscribed(cdcValueIsSubscribed)
    }
  }, [userValueIsSubscribed, cdcValueIsSubscribed])

  const defaultValues = useMemo(() => {
    return {
      postalCode: userPreferences?.preferredPostalCode ?? '',
      categories: userPreferences
        ? sanitizeSelectedCategories({
            availableCategories,
            selectedCategoryIds: [
              userPreferences.preferredProductCategoryId1,
              userPreferences.preferredProductCategoryId2,
              userPreferences.preferredProductCategoryId3,
              userPreferences.preferredProductCategoryId4,
            ],
          })
        : [],
    }
  }, [userPreferences, availableCategories])

  const preferencesForm = usePreferences({ getIsValidPostalCode, defaultValues })
  const [preferencesAlertVisible, setPreferencesAlertVisible] = useState(false)
  const currentValues = useWatch(preferencesForm)

  const formIsDirty = useMemo(() => {
    return isPreferencesFormDirty(defaultValues, currentValues)
  }, [defaultValues, currentValues])

  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>()

  const navigationOnBeforeRemoveCallback = useCallback<UseNavigationOnBeforeRemoveCallback>(
    e => {
      if (!formIsDirty) {
        // If we don't have unsaved changes, then we don't need to do anything
        return
      }

      // Prevent default behavior of leaving the screen
      e.preventDefault()

      // Prompt the user before leaving the screen
      setPreferencesAlertVisible(true)
    },
    [formIsDirty, setPreferencesAlertVisible],
  )

  const { unsubscribeOnBeforeRemoveCallback } = useNavigationOnBeforeRemove(
    navigationOnBeforeRemoveCallback,
    navigation,
  )
  const onClose = useCallback(() => {
    if (formIsDirty) {
      setPreferencesAlertVisible(true)
    } else {
      onPressClose()
    }

    return true
  }, [onPressClose, formIsDirty])

  const onDismissAlert = useCallback(() => {
    setPreferencesAlertVisible(false)
  }, [])

  const setToggleSwitch = useCallback((isEnabled: boolean) => {
    setUserValueIsSubscribed(isEnabled)
  }, [])

  const onSubmit = useCallback(
    async (data: AccountInfoData) => {
      const params: AccountsSetAccountInfoSignedRequestParams = {
        data,
      }

      try {
        if (typeof userValueIsSubscribed === 'boolean' && userValueIsSubscribed !== cdcValueIsSubscribed) {
          params.subscriptions = {
            editorialInformation: {
              email: {
                isSubscribed: userValueIsSubscribed,
              },
            },
          }
        }
        await setAccountInfo(params)
        unsubscribeOnBeforeRemoveCallback()
        afterSubmitTriggered()
      } catch (error: unknown) {
        if (error instanceof ErrorWithCode) {
          ErrorAlertManager.current?.showError(error)
        } else {
          logger.warn('setAccountInfo error cannot be interpreted', JSON.stringify(error))
          ErrorAlertManager.current?.showError(new UnknownError('Preferences SetAccountInfo'))
        }
      }
    },
    [
      setAccountInfo,
      unsubscribeOnBeforeRemoveCallback,
      afterSubmitTriggered,
      userValueIsSubscribed,
      cdcValueIsSubscribed,
    ],
  )

  useAndroidBackButtonHandler(onClose)

  const onDiscardAlert = useCallback(() => {
    preferencesForm.reset(defaultValues)
    setPreferencesAlertVisible(false)
    unsubscribeOnBeforeRemoveCallback()
    onPressClose()
  }, [preferencesForm, defaultValues, onPressClose, unsubscribeOnBeforeRemoveCallback])

  return (
    <>
      <UpdateProfileAlert visible={preferencesAlertVisible} onDiscard={onDiscardAlert} onDismiss={onDismissAlert} />
      <LoadingIndicator loading={preferenceCategories.isLoading || accountInfo.isLoading} />
      <Screen
        testID={buildTestId('preferences')}
        header={
          <ScreenHeader
            title={t('editPreferences_title')}
            testID={buildTestId('editPreferences_title')}
            onPressClose={formIsDirty ? onClose : undefined}
            onPressBack={onClose}
            screenType="subscreen"
          />
        }>
        <Preferences
          form={preferencesForm}
          inModal={false}
          onPressSubmit={onSubmit}
          userPreferences={accountInfo.data?.data}
          availableCategories={preferenceCategories.data?.categories}
          submitButtonI18nKey="preferences_form_profile_edit_submit"
          getIsValidPostalCode={getIsValidPostalCode}
          setToggleSwitch={setToggleSwitch}
          isEmailSubscribed={userValueIsSubscribed}
          onClickEditorialEmailConsent={onPressEmailInfo}
        />
      </Screen>
    </>
  )
}
