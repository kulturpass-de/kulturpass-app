import React, { useCallback } from 'react'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'
import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { Preferences } from '../../features/preferences/components/preferences'
import { commerceApi } from '../../services/api/commerce-api'
import { AccountInfoData } from '../../services/api/types'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useUserInfo } from '../../services/user/use-user-info'

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

  const onSubmit = useCallback(
    async (data: AccountInfoData) => {
      await setAccountInfo({ data })
      afterSubmitTriggered()
    },
    [setAccountInfo, afterSubmitTriggered],
  )

  return (
    <>
      <LoadingIndicator loading={preferenceCategories.isLoading || accountInfo.isLoading} />
      <Screen
        testID={buildTestId('preferences')}
        header={
          <ScreenHeader
            title={t('editPreferences_title')}
            testID={buildTestId('editPreferences_title')}
            onPressClose={onPressClose}
            screenType="subscreen"
          />
        }>
        <Preferences
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
