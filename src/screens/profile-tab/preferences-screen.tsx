import React, { useCallback, useMemo, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'
import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { Preferences } from '../../features/preferences/components/preferences'
import { useAndroidBackButtonHandler } from '../../features/preferences/hooks/use-android-back-button-handler'
import { usePreferences } from '../../features/preferences/hooks/use-preferences'
import { isPreferencesFormDirty } from '../../features/preferences/utils/is-preferences-form-dirty'
import { sanitizeSelectedCategories } from '../../features/preferences/utils/sanitize-selected-categories'
import { commerceApi } from '../../services/api/commerce-api'
import { AccountInfoData } from '../../services/api/types'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useUserInfo } from '../../services/user/use-user-info'
import { PreferencesAlert } from './preferences-alert'

export type PreferencesScreenProps = {
  afterSubmitTriggered: () => void
  onPressClose: () => void
}

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ afterSubmitTriggered, onPressClose }) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()
  const preferenceCategories = commerceApi.useGetPreferenceCategoriesQuery()
  const { setAccountInfo, accountInfo } = useUserInfo()
  const [getIsValidPostalCode] = commerceApi.useLazyGetIsValidPostalCodeQuery()

  const availableCategories = preferenceCategories.data?.categories
  const userPreferences = accountInfo.data?.data

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

  const onClose = useCallback(() => {
    if (formIsDirty) {
      setPreferencesAlertVisible(true)
    } else {
      onPressClose()
    }

    return true
  }, [onPressClose, formIsDirty])

  const onDiscardAlert = useCallback(() => {
    setPreferencesAlertVisible(false)
    onPressClose()
  }, [onPressClose])

  const onDismissAlert = useCallback(() => {
    setPreferencesAlertVisible(false)
  }, [])

  const onSubmit = useCallback(
    async (data: AccountInfoData) => {
      await setAccountInfo({ data })
      afterSubmitTriggered()
    },
    [setAccountInfo, afterSubmitTriggered],
  )

  useAndroidBackButtonHandler(onClose)

  return (
    <>
      <PreferencesAlert visible={preferencesAlertVisible} onDiscard={onDiscardAlert} onDismiss={onDismissAlert} />
      <LoadingIndicator loading={preferenceCategories.isLoading || accountInfo.isLoading} />
      <Screen
        testID={buildTestId('preferences')}
        header={
          <ScreenHeader
            title={t('editPreferences_title')}
            testID={buildTestId('editPreferences_title')}
            onPressClose={formIsDirty ? onPressClose : undefined}
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
        />
      </Screen>
    </>
  )
}
