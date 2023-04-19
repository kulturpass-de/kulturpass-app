import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { LinkText } from '../../../components/link-text/link-text'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'

export type EidNFCNotSupportedScreenProps = {
  onClose: () => void
}

export const EidNFCNotSupportedScreen: React.FC<EidNFCNotSupportedScreenProps> = ({ onClose }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()

  const screenTestId = buildTestId('eid_nfcNotSupported')

  return (
    <ModalScreen whiteBottom testID={screenTestId}>
      <ModalScreenHeader
        testID={addTestIdModifier(screenTestId, 'title')}
        titleI18nKey="eid_nfcNotSupported_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration
          testID={addTestIdModifier(screenTestId, 'image_alt')}
          i18nKey="eid_nfcNotSupported_image_alt"
          type="nfc-not-supported"
        />
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={styles.contentTitle}
            testID={addTestIdModifier(screenTestId, 'content_title')}
            i18nKey="eid_nfcNotSupported_content_title"
            textStyle="HeadlineH4Extrabold"
          />
          <TranslatedText
            textStyleOverrides={styles.contentText}
            testID={addTestIdModifier(screenTestId, 'content_text')}
            i18nKey="eid_nfcNotSupported_content_text"
            textStyle="BodyRegular"
          />
          <View style={styles.linkContainer}>
            <LinkText i18nKey="eid_nfcNotSupported_content_link" link="https://www.sap.de" />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonFooter}>
        <Button
          onPress={onClose}
          variant="primary"
          testID={buildTestId('eid_nfcNotSupported_ok_button')}
          i18nKey="eid_nfcNotSupported_ok_button"
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
  contentText: {
    paddingTop: spacing[7],
    color: colors.moonDarkest,
  },
  linkContainer: {
    paddingTop: spacing[9],
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
