import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { LinkText } from '../../../components/link-text/link-text'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { locationService } from '../../../services/location/location-service'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { Language } from '../../../services/translation/types'
import { userSlice } from '../../../services/user/redux/user-slice'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { URLS } from '../../../utils/constants'
import { OnboardingScreen } from '../components/onboarding-screen'

export type OnboardingLocationPermissionScreenProps = {
  onNext: () => void
}

export const OnboardingLocationPermissionScreen: React.FC<OnboardingLocationPermissionScreenProps> = ({ onNext }) => {
  const { colors } = useTheme()
  const dispatch = useDispatch()

  const onAccept = useCallback(async () => {
    try {
      const granted = await locationService.requestLocationPermission()
      if (!granted) {
        dispatch(userSlice.actions.setUserDeniedLocationServices(true))
      }
    } catch (e) {
      // Location permission not granted
    } finally {
      onNext()
    }
  }, [onNext, dispatch])

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
              testID={buildTestId('onboarding_locationPermission_iosLink')}
              i18nKey="onboarding_locationPermission_iosLink"
              link={language === Language.de ? URLS.IOS_DE_LOCATION_PERMISSION : URLS.IOS_EN_LOCATION_PERMISSION}
            />
          </View>
          <View style={styles.linkContainer}>
            <LinkText
              testID={buildTestId('onboarding_locationPermission_androidLink')}
              i18nKey="onboarding_locationPermission_androidLink"
              link={
                language === Language.de ? URLS.ANDROID_DE_LOCATION_PERMISSION : URLS.ANDROID_EN_LOCATION_PERMISSION
              }
            />
          </View>
          <TranslatedText
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
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
  },
  linkContainer: {
    paddingTop: spacing[6],
  },
})
