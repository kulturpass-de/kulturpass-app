import React, { useCallback, useState } from 'react'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { EditorialEmailConsentView } from '../../../features/delta-onboarding/components/editorial-email-consent-view'
import { Preferences } from '../../../features/preferences/components/preferences'
import { usePreferences } from '../../../features/preferences/hooks/use-preferences'
import { commerceApi } from '../../../services/api/commerce-api'
import { AccountInfoData, AccountsSetAccountInfoSignedRequestParams } from '../../../services/api/types'
import { ErrorAlertManager } from '../../../services/errors/error-alert-provider'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { logger } from '../../../services/logger'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useSetAccountInfo } from '../../../services/user/use-set-account-info'
import { useDisableModalSwipeToClose } from '../../../utils/navigation/use-disable-modal-swipe-to-close'

export type RegistrationPreferencesScreenProps = {
  regToken: string
  afterSubmitTriggered: () => void
  onPressClose: () => void
}

export const RegistrationPreferencesScreen: React.FC<RegistrationPreferencesScreenProps> = ({
  regToken,
  afterSubmitTriggered,
  onPressClose,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const preferenceCategories = commerceApi.useGetPreferenceCategoriesQuery()
  const [getIsValidPostalCode] = commerceApi.useLazyGetIsValidPostalCodeQuery()
  const setAccountInfo = useSetAccountInfo(regToken)
  useDisableModalSwipeToClose()

  const preferencesForm = usePreferences({ getIsValidPostalCode })
  const [userValueIsSubscribed, setUserValueIsSubscribed] = useState<undefined | boolean>()

  const [isEditorialEmailConsentDetailsVisible, setIsEditorialEmailConsentDetailsVisible] = useState(false)

  const openEditorialEmailConsentDetails = useCallback(() => {
    setIsEditorialEmailConsentDetailsVisible(true)
  }, [])

  const closeEditorialEmailConsentDetails = useCallback(() => {
    setIsEditorialEmailConsentDetailsVisible(false)
  }, [])

  const onSubmit = useCallback(
    async (data: AccountInfoData) => {
      const params: AccountsSetAccountInfoSignedRequestParams = {
        data,
      }

      try {
        if (userValueIsSubscribed !== undefined) {
          params.subscriptions = {
            editorialInformation: {
              email: {
                isSubscribed: userValueIsSubscribed,
              },
            },
          }
        }
        await setAccountInfo(params)
        afterSubmitTriggered()
      } catch (error: unknown) {
        if (error instanceof ErrorWithCode) {
          ErrorAlertManager.current?.showError(error)
        } else {
          logger.warn('setAccountInfo error cannot be interpreted', JSON.stringify(error))
          ErrorAlertManager.current?.showError(new UnknownError('Registration Preferences SetAccountInfo'))
        }
      }
    },
    [setAccountInfo, afterSubmitTriggered, userValueIsSubscribed],
  )

  const setToggleSwitch = useCallback((isEnabled: boolean) => {
    setUserValueIsSubscribed(isEnabled)
  }, [])

  return (
    <>
      <LoadingIndicator loading={preferenceCategories.isLoading} />
      <ModalScreen whiteBottom={!isEditorialEmailConsentDetailsVisible} testID={buildTestId('preferences')}>
        {isEditorialEmailConsentDetailsVisible ? (
          <>
            <ModalScreenHeader
              titleI18nKey="editorial_email_consent_modal_title"
              testID={buildTestId('preferences_editorial_email_consent_modal_title')}
              onPressBack={closeEditorialEmailConsentDetails}
              onPressClose={onPressClose}
            />

            <EditorialEmailConsentView />
          </>
        ) : (
          <>
            <ModalScreenHeader
              titleI18nKey="preferences_headline"
              testID={buildTestId('preferences_headline')}
              onPressClose={onPressClose}
            />
            <Preferences
              inModal
              form={preferencesForm}
              onPressSubmit={onSubmit}
              availableCategories={preferenceCategories.data?.categories}
              submitButtonI18nKey="preferences_form_registration_submit"
              getIsValidPostalCode={getIsValidPostalCode}
              setToggleSwitch={setToggleSwitch}
              isEmailSubscribed={userValueIsSubscribed}
              onClickEditorialEmailConsent={openEditorialEmailConsentDetails}
            />
          </>
        )}
      </ModalScreen>
    </>
  )
}
