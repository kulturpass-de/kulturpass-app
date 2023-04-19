import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { Button } from '../../components/button/button'
import { Checkbox } from '../../components/checkbox/checkbox'
import { LinkText } from '../../components/link-text/link-text'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../components/screen/screen-content'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { addTestIdModifier, buildTestId } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

export type RegistrationConsentScreenProps = {
  onHeaderPressClose: () => void
  onPressContinue: () => void
}
const SCREEN_TEST_ID = 'registration_consent'

export const RegistrationConsentScreen: React.FC<RegistrationConsentScreenProps> = ({
  onHeaderPressClose,
  onPressContinue,
}) => {
  const [eulaAccepted, setEulaAccepted] = useState(false)
  const [dataPricacyAccepted, setDataPricacyAccepted] = useState(false)

  return (
    <ModalScreen whiteBottom testID={buildTestId('registration_consent')}>
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
          link="https://www.sap.de"
          i18nKey="registration_consent_eula_linktext"
          textStyle="BodyMedium"
          style={styles.eulaLinkText}
        />
        <Checkbox i18nKey="registration_consent_eula_checkbox" onChange={setEulaAccepted} selected={eulaAccepted} />

        <TranslatedText
          i18nKey="registration_consent_data_privacy_copytext"
          textStyle={'BodySmallRegular'}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'dataPrivacy_copytext')}
          textStyleOverrides={styles.dataPrivacyCopyText}
        />
        <LinkText
          link="https://www.sap.de"
          i18nKey="registration_consent_data_privacy_linktext"
          textStyle="BodyMedium"
          style={styles.dataPrivacyLinkText}
        />
        <Checkbox
          i18nKey="registration_consent_data_privacy_checkbox"
          onChange={setDataPricacyAccepted}
          selected={dataPricacyAccepted}
        />
      </ScreenContent>
      <View style={styles.submitButtonView}>
        <Button
          disabled={!(eulaAccepted && dataPricacyAccepted)}
          testID={buildTestId('registration_consent_submit')}
          i18nKey="registration_consent_submit"
          onPress={onPressContinue}
        />
      </View>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: spacing[5],
  },
  submitButtonView: {
    paddingTop: spacing[5],
    paddingHorizontal: spacing[5],
    borderTopColor: colors.moonDarkest,
    borderTopWidth: 2,
    backgroundColor: colors.basicWhite,
  },
  headline: {
    paddingTop: spacing[7],
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
