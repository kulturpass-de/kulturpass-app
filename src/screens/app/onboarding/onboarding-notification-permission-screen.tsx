import React, { useCallback, useEffect, useState } from 'react'
import {
  type NotificationsResponse,
  requestNotifications,
  openSettings,
  checkNotifications,
} from 'react-native-permissions'
import { useDispatch } from 'react-redux'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { OnboardingPermissionsDeniedScreen } from '../../../components/onboarding/onboarding-permissions-denied-screen'
import { OnboardingScreen } from '../../../components/onboarding/onboarding-screen'
import { logger } from '../../../services/logger'
import { notificationsStartup } from '../../../services/notifications/store/thunks/notifications-startup'
import { AppDispatch } from '../../../services/redux/configure-store'
import { isInForeground, useAppState } from '../../../services/redux/subscriptions/subscribe-to-app-state'
import { useTestIdBuilder } from '../../../services/test-id/test-id'

export type OnboardingNotificationPermissionScreenProps = {
  onNext: () => void
}

export const OnboardingNotificationPermissionScreen: React.FC<OnboardingNotificationPermissionScreenProps> = ({
  onNext,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const appState = useAppState()
  const [notificationsResponse, setNotificationsResponse] = useState<undefined | NotificationsResponse>()
  const [blockedNotificationViewVisible, setBlockedNotificationViewVisible] = useState(false)

  useEffect(() => {
    if (isInForeground(appState)) {
      checkNotifications().then(setNotificationsResponse)
    }
  }, [appState, blockedNotificationViewVisible])

  const onAccept = useCallback(async () => {
    let blocked = false
    setIsLoading(true)

    try {
      if (notificationsResponse?.status !== 'granted') {
        const response = await requestNotifications(['alert', 'sound', 'badge'])
        setNotificationsResponse(response)

        if (response.status === 'blocked') {
          setBlockedNotificationViewVisible(true)
          blocked = true
        } else if (response.status === 'granted') {
          await dispatch(notificationsStartup()).unwrap()
        }
      } else {
        await dispatch(notificationsStartup()).unwrap()
      }
    } catch (error: unknown) {
      logger.logError('Onboard Notifications', error)
    } finally {
      setIsLoading(false)

      if (!blocked) {
        onNext()
      }
    }
  }, [dispatch, onNext, notificationsResponse])

  const onOpenDeviceSettings = useCallback(async () => {
    setIsLoading(true)
    try {
      await openSettings()
    } catch (error: unknown) {
      logger.logError('Onboard Notifications', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const onDeny = useCallback(async () => {
    setIsLoading(true)

    try {
      if (notificationsResponse?.status === 'granted') {
        setBlockedNotificationViewVisible(true)
      } else {
        onNext()
      }
    } catch (error: unknown) {
      logger.logError('Onboard Notifications', error)
    } finally {
      setIsLoading(false)
    }
  }, [notificationsResponse, onNext])

  const { buildTestId, addTestIdModifier } = useTestIdBuilder()

  const screenTestID = buildTestId('onboarding_notificationPermission')

  return (
    <>
      <LoadingIndicator loading={isLoading} />
      {blockedNotificationViewVisible ? (
        <OnboardingPermissionsDeniedScreen
          testID={addTestIdModifier(screenTestID, 'denied')}
          titleI18nKey="onboarding_notificationPermission_denied_headline_title"
          contentTitleI18nKey="onboarding_notificationPermission_denied_content_title"
          contentPermissionLeftI18nKey="onboarding_notificationPermission_denied_text_left_content_title"
          contentPermissionRightI18nKey={
            notificationsResponse?.status === 'granted'
              ? 'onboarding_notificationPermission_denied_text_right_content_on'
              : 'onboarding_notificationPermission_denied_text_right_content_off'
          }
          contentTextI18nKeyFirst="onboarding_notificationPermission_denied_content_text_android"
          acceptButtonI18nKey="onboarding_notificationPermission_denied_acceptButton"
          denyButtonI18nKey="onboarding_notificationPermission_denied_denyButton"
          illustrationI18nKey="onboarding_notificationPermission_image_alt"
          illustrationType="notification-permission"
          onAccept={onOpenDeviceSettings}
          onDeny={onNext}
        />
      ) : (
        <OnboardingScreen
          testID={screenTestID}
          titleI18nKey="onboarding_notificationPermission_headline_title"
          contentTitleI18nKey="onboarding_notificationPermission_content_title"
          contentTextI18nKeyFirst="onboarding_notificationPermission_content_text_first"
          contentTextI18nKeySecond="onboarding_notificationPermission_content_text_second"
          contentTextI18nKeyThird="onboarding_notificationPermission_content_text_third"
          contentTextI18nKeyFourth="onboarding_notificationPermission_content_text_fourth"
          acceptButtonI18nKey="onboarding_notificationPermission_acceptButton"
          denyButtonI18nKey="onboarding_notificationPermission_denyButton"
          illustrationI18nKey="onboarding_notificationPermission_image_alt"
          dataprivacyI18nKey="onboarding_notificationPermission_dpsLink"
          illustrationType="notification-permission"
          onAccept={onAccept}
          onDeny={onDeny}
        />
      )}
    </>
  )
}
