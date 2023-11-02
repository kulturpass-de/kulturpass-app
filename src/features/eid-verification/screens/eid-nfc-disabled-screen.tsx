import { AA2WorkflowHelper } from '@sap/react-native-ausweisapp2-wrapper'
import React, { useCallback } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { InfoBox } from '../../../components/info-box/info-box'
import { LinkText } from '../../../components/link-text/link-text'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { logger } from '../../../services/logger'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export type EidNFCDisabledScreenProps = {
  onClose: () => void
}

export const EidNFCDisabledScreen: React.FC<EidNFCDisabledScreenProps> = ({ onClose }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  const showNFCSettings = useCallback(() => {
    if (Platform.OS === 'android') {
      AA2WorkflowHelper.openNfcSettings().catch((error: unknown) => logger.logError('Open NFC settings', error))
    }
  }, [])

  const eidGeneralFaqLink = useFaqLink('EID_IDENTIFICATION_GENERAL')

  const screenTestId = buildTestId('eid_nfcDisabled')

  return (
    <ModalScreen whiteBottom testID={screenTestId}>
      <ModalScreenHeader
        testID={addTestIdModifier(screenTestId, 'title')}
        titleI18nKey="eid_nfcDisabled_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration
          testID={buildTestId('eid_nfcDisabled_image_alt')}
          i18nKey="eid_nfcDisabled_image_alt"
          type="eid-nfc-disabled"
        />
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'content_title')}
            i18nKey="eid_nfcDisabled_content_title"
            textStyle="HeadlineH3Extrabold"
          />
          <InfoBox containerStyle={styles.activateNfcBox}>
            <View style={styles.activateNfcBoxContent}>
              <SvgImage type="nfc" width={36} height={36} />
              <TranslatedText
                textStyleOverrides={[styles.activateNfcBoxText, { color: colors.labelColor }]}
                testID={addTestIdModifier(screenTestId, 'activateNfc_android_text')}
                i18nKey="eid_nfcDisabled_activateNfc_text"
                textStyle="BodySmallSemibold"
              />
            </View>
            <Button
              variant="secondary"
              modifier="small"
              onPress={showNFCSettings}
              i18nKey="eid_nfcDisabled_activateNfc_openNfcSettings_button"
              testID={addTestIdModifier(screenTestId, 'activateNfc_openNfcSettings_button')}
            />
          </InfoBox>
          <TranslatedText
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'content_text')}
            i18nKey="eid_nfcDisabled_content_text"
            textStyle="BodyRegular"
          />
          <View style={styles.linkContainer}>
            <LinkText
              testID={addTestIdModifier(screenTestId, 'content_link')}
              i18nKey="eid_nfcDisabled_content_link"
              link={eidGeneralFaqLink}
            />
          </View>
        </View>
      </ScrollView>
      <ModalScreenFooter>
        <Button
          onPress={onClose}
          variant="primary"
          testID={addTestIdModifier(screenTestId, 'ok_button')}
          i18nKey="eid_nfcDisabled_ok_button"
        />
      </ModalScreenFooter>
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
    paddingBottom: spacing[6],
  },
  contentTitle: {
    paddingTop: spacing[7],
    paddingBottom: spacing[6],
    flexWrap: 'wrap',
  },
  contentText: {
    paddingTop: spacing[7],
  },
  linkContainer: {
    paddingTop: spacing[9],
  },
  activateNfcBox: {
    flexDirection: 'column',
    flexShrink: 1,
    gap: spacing[5],
  },
  activateNfcBoxContent: {
    flexDirection: 'row',
    flexShrink: 1,
    gap: spacing[4],
  },
  activateNfcBoxText: {
    flexShrink: 1,
  },
})
