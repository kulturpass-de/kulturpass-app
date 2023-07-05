import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button } from '../../components/button/button'
import { Checkbox } from '../../components/checkbox/checkbox'
import { LinkText } from '../../components/link-text/link-text'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../components/screen/screen-content'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { addTestIdModifier, buildTestId } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import {
  useLocalizedEnvironmentUrl,
  getCdcDpsDocumentUrl,
  getCdcEulaDocumentUrl,
} from '../../utils/links/hooks/use-localized-environment-url'

export type RegistrationConsentScreenProps = {
  onHeaderPressClose: () => void
  onPressContinue: () => void
}
const SCREEN_TEST_ID = 'registration_consent'

export const RegistrationConsentScreen: React.FC<RegistrationConsentScreenProps> = ({
  onHeaderPressClose,
  onPressContinue,
}) => {
  const dpsDocumentUrl = useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl)
  const eulaDocumentUrl = useLocalizedEnvironmentUrl(getCdcEulaDocumentUrl)
  const [eulaAccepted, setEulaAccepted] = useState(false)
  const [dataPricacyAccepted, setDataPricacyAccepted] = useState(false)

  return (
    <ModalScreen whiteBottom testID={SCREEN_TEST_ID}>
      <ModalScreenHeader
        titleI18nKey="registration_consent_screen_title"
        testID={buildTestId('registration_consent_screen_title')}
        onPressClose={onHeaderPressClose}
      />
      <ScreenContent style={styles.screenContent}>
        <TranslatedText
          i18nKey="registration_consent_headline"
          textStyle={'HeadlineH3Extrabold'}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'headline')}
          textStyleOverrides={styles.headline}
        />
        <TranslatedText
          i18nKey="registration_consent_eula_headline"
          textStyle={'BodyMedium'}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'eula_headline')}
          textStyleOverrides={styles.eulaHeadline}
        />
        <TranslatedText
          i18nKey="registration_consent_eula_copytext"
          textStyle={'BodySmallRegular'}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'eula_copytext')}
          textStyleOverrides={styles.eulaCopytext}
        />
        <LinkText
          link={eulaDocumentUrl}
          i18nKey="registration_consent_eula_linktext"
          testID={addTestIdModifier(SCREEN_TEST_ID, 'eula_linktext')}
          textStyle="BodyMedium"
          style={styles.eulaLinkText}
        />
        <Checkbox
          i18nKey="registration_consent_eula_checkbox"
          testID={addTestIdModifier(SCREEN_TEST_ID, 'eula_checkbox')}
          onChange={setEulaAccepted}
          selected={eulaAccepted}
        />

        <TranslatedText
          i18nKey="registration_consent_data_privacy_copytext"
          textStyle={'BodySmallRegular'}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'data_privacy_copytext')}
          textStyleOverrides={styles.dataPrivacyCopyText}
        />
        <LinkText
          link={dpsDocumentUrl}
          i18nKey="registration_consent_data_privacy_linktext"
          testID={addTestIdModifier(SCREEN_TEST_ID, 'data_privacy_linktext')}
          textStyle="BodyMedium"
          style={styles.dataPrivacyLinkText}
        />
        <Checkbox
          i18nKey="registration_consent_data_privacy_checkbox"
          testID={addTestIdModifier(SCREEN_TEST_ID, 'data_privacy_checkbox')}
          onChange={setDataPricacyAccepted}
          selected={dataPricacyAccepted}
        />
      </ScreenContent>
      <ModalScreenFooter>
        <Button
          disabled={!(eulaAccepted && dataPricacyAccepted)}
          i18nKey="registration_consent_submit"
          testID={addTestIdModifier(SCREEN_TEST_ID, 'submit')}
          onPress={onPressContinue}
        />
      </ModalScreenFooter>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[7],
  },
  headline: {
    paddingBottom: spacing[6],
    color: colors.basicBlack,
  },
  eulaHeadline: {
    paddingBottom: spacing[5],
    color: colors.moonDarkest,
  },
  eulaCopytext: {
    paddingBottom: spacing[5],
    color: colors.moonDarkest,
  },
  eulaLinkText: {
    paddingBottom: spacing[5],
  },
  dataPrivacyCopyText: {
    paddingTop: spacing[6],
    paddingBottom: spacing[5],
    color: colors.moonDarkest,
  },
  dataPrivacyLinkText: {
    paddingBottom: spacing[5],
  },
})
