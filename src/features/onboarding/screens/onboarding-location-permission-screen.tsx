import React, { useCallback } from 'react'

import { locationService } from '../../../services/location/location-service'
import { OnboardingScreen } from '../components/onboarding-screen'

export type OnboardingLocationPermissionScreenProps = {
  onNext: () => void
}

export const OnboardingLocationPermissionScreen: React.FC<OnboardingLocationPermissionScreenProps> = ({ onNext }) => {
  const onAccept = useCallback(async () => {
    try {
      await locationService.requestLocationPermission()
    } catch (e) {
      console.log('Location Permission not granted')
    } finally {
      onNext()
    }
  }, [onNext])

  return (
    <OnboardingScreen
      testID="onboarding_locationPermission"
      titleI18nKey="onboarding_locationPermission_headline_title"
      contentTitleI18nKey="onboarding_locationPermission_content_title"
      contentTextI18nKey="onboarding_locationPermission_content_text"
      acceptButtonI18nKey="onboarding_locationPermission_acceptButton"
      denyButtonI18nKey="onboarding_locationPermission_denyButton"
      illustrationI18nKey="onboarding_locationPermission_image_alt"
      dataprivacyI18nKey="onboarding_locationPermission_dpsLink"
      illustrationType="localisation-consent"
      onAccept={onAccept}
      onDeny={onNext}
    />
  )
}
