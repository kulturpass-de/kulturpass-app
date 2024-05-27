import { NavigatorScreenParams } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { AccountSubscriptionsData } from '../../../services/api/types'
import { ErrorAlertManager } from '../../../services/errors/error-alert-provider'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { logger } from '../../../services/logger'
import { useSetAccountInfo } from '../../../services/user/use-set-account-info'
import { modalCardStyle } from '../../../theme/utils'
import { useDisableModalSwipeToClose } from '../../../utils/navigation/use-disable-modal-swipe-to-close'
import { useAndroidBackButtonHandler } from '../../preferences/hooks/use-android-back-button-handler'
import {
  setShowEditorialEmailModalOnStartup,
  setUserDismissedEditorialEmailModal,
} from '../redux/delta-onboarding-slice'
import { EditorialEmailConsentModalScreen } from './editorial-email-consent-modal-screen'

export const EditorialEmailConsentModalRouteName = 'EditorialEmailConsentModal'

export type EditorialEmailConsentModalRouteParams = undefined

export type EditorialEmailConsentModalRouteStackParams = {
  EditorialEmailConsentModal: NavigatorScreenParams<EditorialEmailConsentModalRouteParams>
}

const EditorialEmailConsentModalRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()
  const dispatch = useDispatch()
  const setAccountInfo = useSetAccountInfo()

  useDisableModalSwipeToClose()

  const onAndroidBack = useCallback(() => {
    return true // prevent going back via hardware button
  }, [])

  useAndroidBackButtonHandler(onAndroidBack)

  const onSubmit = useCallback(
    async (subscriptions: AccountSubscriptionsData) => {
      try {
        await setAccountInfo({ subscriptions })
      } catch (error: unknown) {
        if (error instanceof ErrorWithCode) {
          ErrorAlertManager.current?.showError(error)
        } else {
          logger.warn('setAccountInfo error cannot be interpreted', JSON.stringify(error))
          ErrorAlertManager.current?.showError(new UnknownError('EditorialEmailConsentModal SetAccountInfo'))
        }
      }
    },
    [setAccountInfo],
  )

  const onAccept = useCallback(async () => {
    dispatch(setShowEditorialEmailModalOnStartup(false))
    dispatch(setUserDismissedEditorialEmailModal(true))
    modalNavigation.goBack()
    onSubmit({ editorialInformation: { email: { isSubscribed: true } } })
  }, [dispatch, modalNavigation, onSubmit])

  const onDecline = useCallback(() => {
    dispatch(setShowEditorialEmailModalOnStartup(false))
    dispatch(setUserDismissedEditorialEmailModal(true))
    modalNavigation.goBack()
    onSubmit({ editorialInformation: { email: { isSubscribed: false } } })
  }, [dispatch, modalNavigation, onSubmit])

  return (
    <EditorialEmailConsentModalScreen
      screenKey="editorial_email_consent_modal"
      onAccept={onAccept}
      onDecline={onDecline}
    />
  )
}

export const EditorialEmailConsentModalRouteConfig = createRouteConfig({
  name: EditorialEmailConsentModalRouteName,
  component: EditorialEmailConsentModalRoute,
  options: { cardStyle: modalCardStyle, gestureEnabled: false },
})
