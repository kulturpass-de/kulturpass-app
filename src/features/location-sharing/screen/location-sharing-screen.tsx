import React from 'react'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { InfoBox } from '../../../components/info-box/info-box'
import { LinkText } from '../../../components/link-text/link-text'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import {
  getCdcDpsDocumentUrl,
  useLocalizedEnvironmentUrl,
} from '../../../utils/links/hooks/use-localized-environment-url'

export type LocationSharingScreenProps = {
  isLoading: boolean
  onClose: () => void
  onOpenLocationSettings: () => void
}

export const LocationSharingScreen: React.FC<LocationSharingScreenProps> = ({
  onClose,
  onOpenLocationSettings,
  isLoading,
}) => {
  const { colors } = useTheme()
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()

  const aboutGeolocationFaqLink = useFaqLink(
    Platform.OS === 'ios' ? 'ABOUT_GEOLOCATION_IOS' : 'ABOUT_GEOLOCATION_ANDROID',
  )
  const dpsDocumentUrl = useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl)

  const screenTestId = buildTestId('location_sharing')

  return (
    <ModalScreen testID={screenTestId} withoutBottomSafeArea>
      <ModalScreenHeader
        testID={addTestIdModifier(screenTestId, 'title')}
        titleI18nKey="location_sharing_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration
          testID={addTestIdModifier(screenTestId, 'image_alt')}
          i18nKey="location_sharing_image_alt"
          type="location-sharing"
        />
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'content_title')}
            i18nKey="location_sharing_content_title"
            textStyle="HeadlineH3Extrabold"
          />
          <TranslatedText
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'content_first_text')}
            i18nKey="location_sharing_content_first_text"
            textStyle="BodyRegular"
          />
          <InfoBox containerStyle={styles.infoBox}>
            <View style={styles.infoBoxContent}>
              <SvgImage type="location" width={36} height={36} />
              <TranslatedText
                textStyleOverrides={[styles.infoBoxText, { color: colors.labelColor }]}
                testID={addTestIdModifier(screenTestId, 'content_box_text')}
                i18nKey="location_sharing_content_box_text"
                textStyle="BodySmallSemibold"
              />
            </View>
            <Button
              variant="secondary"
              modifier="small"
              onPress={onOpenLocationSettings}
              disabled={isLoading}
              i18nKey="location_sharing_content_box_button_text"
              testID={addTestIdModifier(screenTestId, 'content_box_button')}
            />
          </InfoBox>
          <TranslatedText
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'content_second_text')}
            i18nKey="location_sharing_content_second_text"
            textStyle="BodyRegular"
          />
          <LinkText
            testID={addTestIdModifier(screenTestId, 'content_info_link')}
            i18nKey={
              Platform.OS === 'ios'
                ? 'location_sharing_content_info_ios_link'
                : 'location_sharing_content_info_android_link'
            }
            link={aboutGeolocationFaqLink}
          />
          <TranslatedText
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'content_third_text')}
            i18nKey="location_sharing_content_third_text"
            textStyle="BodyRegular"
          />
          <LinkText
            testID={addTestIdModifier(screenTestId, 'content_dataprivacy_link')}
            i18nKey="location_sharing_content_dataprivacy_link"
            link={dpsDocumentUrl}
          />
        </View>
      </ScrollView>
    </ModalScreen>
  )
}

export const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[8],
  },
  contentTitle: {
    paddingTop: spacing[7],
    flexWrap: 'wrap',
  },
  contentText: {
    paddingVertical: spacing[6],
  },
  infoBox: {
    flexDirection: 'column',
    flexShrink: 1,
    gap: spacing[5],
  },
  infoBoxContent: {
    flexDirection: 'row',
    flexShrink: 1,
    gap: spacing[4],
  },
  infoBoxText: {
    flexShrink: 1,
  },
})
