import { SerializedError } from '@reduxjs/toolkit'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '../../../components/button/button'
import { Icon } from '../../../components/icon/icon'
import { Illustration } from '../../../components/illustration/illustration'
import { LinkText } from '../../../components/link-text/link-text'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { ErrorWithCode } from '../../../services/errors/errors'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { useInitAA2Sdk } from '../hooks/use-init-aa2-sdk'
import { useStartAA2Auth } from '../hooks/use-start-aa2-auth'
import { AccessRightsMessage, CertificateMessage } from '@jolocom/react-native-ausweis/js/messageTypes'

export type EidAboutVerificationScreenProps = {
  onNext: (accessRights: AccessRightsMessage, certificate: CertificateMessage) => void
  onNFCNotSupported: () => void
  onError: (error: ErrorWithCode | SerializedError) => void
  onClose: () => void
}

export const EidAboutVerificationScreen: React.FC<EidAboutVerificationScreenProps> = ({
  onNext,
  onNFCNotSupported,
  onError,
  onClose,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()

  const { isLoading: initLoading } = useInitAA2Sdk()

  const { isLoading: startAuthLoading, startAuth } = useStartAA2Auth(onNext, onNFCNotSupported, onError)

  const screenTestId = buildTestId('eid_aboutVerification')

  return (
    <ModalScreen whiteBottom testID={screenTestId}>
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
            textStyleOverrides={styles.contentTitle}
            testID={addTestIdModifier(screenTestId, 'content_title')}
            i18nKey="eid_aboutVerification_content_title"
            textStyle="HeadlineH3Extrabold"
          />
          <View style={styles.idListContainer}>
            <View style={[styles.idListItem, styles.idListItemPadding, styles.idListItemWrapping]}>
              <Icon source="ID1" width={24} height={24} />
              <TranslatedText
                textStyle="BodyRegular"
                textStyleOverrides={styles.idListItemText}
                i18nKey="eid_document_germandID"
                testID={buildTestId('eid_document_germandID')}
              />
            </View>
            <View style={[styles.idListItem, styles.idListItemPadding, styles.idListItemWrapping]}>
              <Icon source="ID2" width={24} height={24} />
              <TranslatedText
                textStyle="BodyRegular"
                textStyleOverrides={styles.idListItemText}
                i18nKey="eid_document_euID"
                testID={buildTestId('eid_document_euID')}
              />
            </View>
            <View style={styles.idListItem}>
              <Icon source="ID2" width={24} height={24} />
              <TranslatedText
                textStyle="BodyRegular"
                textStyleOverrides={[styles.idListItemText, styles.idListItemWrapping]}
                i18nKey="eid_document_nonEuID"
                testID={buildTestId('eid_document_nonEuID')}
              />
            </View>
          </View>
          <TranslatedText
            i18nKey="eid_aboutVerification_content_text"
            textStyle="BodyRegular"
            textStyleOverrides={[styles.textPadding, { color: colors.moonDarkest }]}
            testID={buildTestId('eid_aboutVerification_content_text')}
          />
          <View style={styles.textPadding}>
            <LinkText i18nKey="eid_aboutVerification_faq_link" link="https://www.sap.de" />
          </View>
          <TranslatedText
            i18nKey="eid_aboutVerification_accept_text"
            textStyle="BodySmallRegular"
            textStyleOverrides={[styles.textPadding, { color: colors.moonDarkest }]}
            testID={buildTestId('eid_aboutVerification_accept_text')}
          />
          <View style={styles.textPadding}>
            <LinkText i18nKey="eid_aboutVerification_dataprivacy_link" link="https://www.sap.de" />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonFooter}>
        <Button
          onPress={startAuth}
          variant="primary"
          disabled={initLoading || startAuthLoading}
          testID={buildTestId('eid_aboutVerification_accept_button')}
          i18nKey="eid_aboutVerification_accept_button"
        />
      </View>
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
    color: colors.moonDarker,
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
    color: colors.moonDarkest,
  },
  idListContainer: {
    flexDirection: 'column',
    paddingTop: spacing[6],
  },
  textPadding: {
    paddingTop: spacing[6],
  },
  buttonFooter: {
    padding: spacing[5],
    backgroundColor: colors.basicWhite,
    borderTopWidth: 2,
    borderTopColor: colors.basicBlack,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    height: 80,
  },
})
