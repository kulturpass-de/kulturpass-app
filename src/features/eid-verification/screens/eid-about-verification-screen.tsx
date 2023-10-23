import { AccessRights, Certificate } from '@sap/react-native-ausweisapp2-wrapper'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { LinkText } from '../../../components/link-text/link-text'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { ErrorWithCode } from '../../../services/errors/errors'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import {
  getCdcDpsDocumentUrl,
  useLocalizedEnvironmentUrl,
} from '../../../utils/links/hooks/use-localized-environment-url'
import { useInitAA2Sdk } from '../hooks/use-init-aa2-sdk'
import { useStartAA2Auth } from '../hooks/use-start-aa2-auth'

export type EidAboutVerificationScreenProps = {
  onNext: (accessRights: AccessRights, certificate: Certificate) => void
  onNFCNotSupported: () => void
  onError: (error: ErrorWithCode) => void
  onClose: () => void
}

export const EidAboutVerificationScreen: React.FC<EidAboutVerificationScreenProps> = ({
  onNext,
  onNFCNotSupported,
  onError,
  onClose,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  const eidGeneralFaqLink = useFaqLink('EID_IDENTIFICATION_GENERAL')
  const dpsDocumentUrl = useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl)

  const { isLoading: initLoading } = useInitAA2Sdk(onError)

  const { isLoading: startAuthLoading, startAuth } = useStartAA2Auth(onNext, onNFCNotSupported, onError)

  const screenTestId = buildTestId('eid_aboutVerification')

  return (
    <ModalScreen whiteBottom testID={screenTestId}>
      <LoadingIndicator loading={initLoading || startAuthLoading} />
      <ModalScreenHeader
        testID={addTestIdModifier(screenTestId, 'title')}
        titleI18nKey="eid_aboutVerification_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration
          testID={addTestIdModifier(screenTestId, 'image_alt')}
          i18nKey="eid_aboutVerification_image_alt"
          type="eid"
        />
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'content_title')}
            i18nKey="eid_aboutVerification_content_title"
            textStyle="HeadlineH3Extrabold"
          />
          <View style={styles.idListContainer}>
            <View style={[styles.idListItem, styles.idListItemPadding, styles.idListItemWrapping]}>
              <SvgImage type="id-1" width={24} height={24} />
              <TranslatedText
                textStyle="BodyRegular"
                textStyleOverrides={[styles.idListItemText, { color: colors.labelColor }]}
                i18nKey="eid_document_germandID"
                testID={buildTestId('eid_document_germandID')}
              />
            </View>
            <View style={[styles.idListItem, styles.idListItemPadding, styles.idListItemWrapping]}>
              <SvgImage type="id-2" width={24} height={24} />
              <TranslatedText
                textStyle="BodyRegular"
                textStyleOverrides={[styles.idListItemText, { color: colors.labelColor }]}
                i18nKey="eid_document_euID"
                testID={buildTestId('eid_document_euID')}
              />
            </View>
            <View style={styles.idListItem}>
              <SvgImage type="id-2" width={24} height={24} />
              <TranslatedText
                textStyle="BodyRegular"
                textStyleOverrides={[styles.idListItemText, { color: colors.labelColor }, styles.idListItemWrapping]}
                i18nKey="eid_document_nonEuID"
                testID={buildTestId('eid_document_nonEuID')}
              />
            </View>
          </View>
          <TranslatedText
            i18nKey="eid_aboutVerification_content_text"
            textStyle="BodyRegular"
            textStyleOverrides={[styles.textPadding, { color: colors.labelColor }]}
            testID={buildTestId('eid_aboutVerification_content_text')}
          />
          <View style={styles.textPadding}>
            <LinkText
              testID={buildTestId('eid_aboutVerification_faq_link')}
              i18nKey="eid_aboutVerification_faq_link"
              link={eidGeneralFaqLink}
            />
          </View>
          <TranslatedText
            i18nKey="eid_aboutVerification_accept_text"
            textStyle="BodySmallRegular"
            textStyleOverrides={[styles.textPadding, { color: colors.labelColor }]}
            testID={buildTestId('eid_aboutVerification_accept_text')}
          />
          <View style={styles.textPadding}>
            <LinkText
              testID={buildTestId('eid_aboutVerification_dataprivacy_link')}
              i18nKey="eid_aboutVerification_dataprivacy_link"
              link={dpsDocumentUrl}
            />
          </View>
        </View>
      </ScrollView>
      <ModalScreenFooter>
        <Button
          onPress={startAuth}
          variant="primary"
          disabled={initLoading || startAuthLoading}
          testID={buildTestId('eid_aboutVerification_accept_button')}
          i18nKey="eid_aboutVerification_accept_button"
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
    flexWrap: 'wrap',
  },
  idListItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idListItemPadding: {
    paddingBottom: spacing[5],
  },
  idListItemWrapping: {
    flex: 1,
  },
  idListItemText: {
    paddingLeft: spacing[5],
    flexWrap: 'wrap',
    flex: 1,
  },
  idListContainer: {
    flexDirection: 'column',
    paddingTop: spacing[6],
  },
  textPadding: {
    paddingTop: spacing[6],
  },
})
