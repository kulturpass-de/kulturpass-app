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
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'
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

export const RegistrationConsentScreen: React.FC<RegistrationConsentScreenProps> = ({
  onHeaderPressClose,
  onPressContinue,
}) => {
  const { colors } = useTheme()
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()

  const dpsDocumentUrl = useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl)
  const eulaDocumentUrl = useLocalizedEnvironmentUrl(getCdcEulaDocumentUrl)
  const [eulaAccepted, setEulaAccepted] = useState(false)
  const [dataPricacyAccepted, setDataPricacyAccepted] = useState(false)

  const screenTestId = buildTestId('registration_consent')

  return (
    <ModalScreen whiteBottom testID={screenTestId}>
      <ModalScreenHeader
        titleI18nKey="registration_consent_screen_title"
        testID={addTestIdModifier(screenTestId, 'screen_title')}
        onPressClose={onHeaderPressClose}
      />
      <ScreenContent style={styles.screenContent}>
        <TranslatedText
          i18nKey="registration_consent_headline"
          textStyle={'HeadlineH3Extrabold'}
          testID={addTestIdModifier(screenTestId, 'headline')}
          textStyleOverrides={[styles.headline, { color: colors.labelColor }]}
        />
        <TranslatedText
          i18nKey="registration_consent_eula_headline"
          textStyle={'BodyMedium'}
          testID={addTestIdModifier(screenTestId, 'eula_headline')}
          textStyleOverrides={[styles.eulaHeadline, { color: colors.labelColor }]}
        />
        <TranslatedText
          i18nKey="registration_consent_eula_copytext"
          textStyle={'BodySmallRegular'}
          testID={addTestIdModifier(screenTestId, 'eula_copytext')}
          textStyleOverrides={[styles.eulaCopytext, { color: colors.labelColor }]}
        />
        <LinkText
          link={eulaDocumentUrl}
          i18nKey="registration_consent_eula_linktext"
          testID={addTestIdModifier(screenTestId, 'eula_linktext')}
          textStyle="BodyMedium"
          style={styles.eulaLinkText}
        />
        <Checkbox
          i18nKey="registration_consent_eula_checkbox"
          testID={addTestIdModifier(screenTestId, 'eula_checkbox')}
          onChange={setEulaAccepted}
          selected={eulaAccepted}
        />

        <TranslatedText
          i18nKey="registration_consent_data_privacy_copytext"
          textStyle={'BodySmallRegular'}
          testID={addTestIdModifier(screenTestId, 'data_privacy_copytext')}
          textStyleOverrides={[styles.dataPrivacyCopyText, { color: colors.labelColor }]}
        />
        <LinkText
          link={dpsDocumentUrl}
          i18nKey="registration_consent_data_privacy_linktext"
          testID={addTestIdModifier(screenTestId, 'data_privacy_linktext')}
          textStyle="BodyMedium"
          style={styles.dataPrivacyLinkText}
        />
        <Checkbox
          i18nKey="registration_consent_data_privacy_checkbox"
          testID={addTestIdModifier(screenTestId, 'data_privacy_checkbox')}
          onChange={setDataPricacyAccepted}
          selected={dataPricacyAccepted}
        />
      </ScreenContent>
      <ModalScreenFooter>
        <Button
          disabled={!(eulaAccepted && dataPricacyAccepted)}
          i18nKey="registration_consent_submit"
          testID={addTestIdModifier(screenTestId, 'submit')}
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
  },
  eulaHeadline: {
    paddingBottom: spacing[5],
  },
  eulaCopytext: {
    paddingBottom: spacing[5],
  },
  eulaLinkText: {
    paddingBottom: spacing[5],
  },
  dataPrivacyCopyText: {
    paddingTop: spacing[6],
    paddingBottom: spacing[5],
  },
  dataPrivacyLinkText: {
    paddingBottom: spacing[5],
  },
})
