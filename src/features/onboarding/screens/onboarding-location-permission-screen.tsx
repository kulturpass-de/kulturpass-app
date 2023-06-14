import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { LinkText } from '../../../components/link-text/link-text'
import { TranslatedText } from '../../../components/translated-text/translated-text'

import { locationService } from '../../../services/location/location-service'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { Language } from '../../../services/translation/types'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { OnboardingScreen } from '../components/onboarding-screen'
import { useDispatch } from 'react-redux'
import { setShowOnboardingOnStartup } from '../redux/onboarding'

export type OnboardingLocationPermissionScreenProps = {
  onNext: () => void
}

export const OnboardingLocationPermissionScreen: React.FC<OnboardingLocationPermissionScreenProps> = ({ onNext }) => {
  const dispatch = useDispatch()

  const onAccept = useCallback(async () => {
    try {
      await locationService.requestLocationPermission()
    } catch (e) {
      // Location permission not granted
    } finally {
      dispatch(setShowOnboardingOnStartup(false))
      onNext()
    }
  }, [dispatch, onNext])

  const { buildTestId } = useTestIdBuilder()

  const testID = 'onboarding_locationPermission'
  const screenTestID = buildTestId(testID)
  const { l: language } = useTranslation()

  return (
    <OnboardingScreen
      testID={screenTestID}
      titleI18nKey="onboarding_locationPermission_headline_title"
      contentTitleI18nKey="onboarding_locationPermission_content_title"
      contentTextI18nKey="onboarding_locationPermission_content_text"
      acceptButtonI18nKey="onboarding_locationPermission_acceptButton"
      illustrationI18nKey="onboarding_locationPermission_image_alt"
      dataprivacyI18nKey="onboarding_locationPermission_dpsLink"
      illustrationType="localisation-consent"
      onAccept={onAccept}
      additionalContent={
        <>
          <View style={styles.linkContainer}>
            <LinkText
              testID="onboarding_locationPermission_iosLink"
              i18nKey="onboarding_locationPermission_iosLink"
              link={
                // TODO: move hardcoded urls out of component
                language === Language.de
                  ? 'https://support.apple.com/de-de/HT207092'
                  : 'https://support.apple.com/en-us/HT207092'
              }
            />
          </View>
          <View style={styles.linkContainer}>
            <LinkText
              testID="onboarding_locationPermission_androidLink"
              i18nKey="onboarding_locationPermission_androidLink"
              link={
                // TODO: move hardcoded urls out of component
                language === Language.de
                  ? 'https://support.google.com/android/answer/3467281?hl=de'
                  : 'https://support.google.com/android/answer/3467281?hl=en'
              }
            />
          </View>
          <TranslatedText
            textStyleOverrides={styles.contentText}
            testID={buildTestId('onboarding_locationPermission_content_additional_text')}
            i18nKey="onboarding_locationPermission_content_additional_text"
            textStyle="BodyRegular"
          />
        </>
      }
    />
  )
}

const styles = StyleSheet.create({
  contentText: {
    paddingTop: spacing[6],
    flexWrap: 'wrap',
    color: colors.moonDarkest,
  },
  linkContainer: {
    paddingTop: spacing[6],
  },
})
