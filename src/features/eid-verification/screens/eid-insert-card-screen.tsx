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
import { useStartCardScanning } from '../hooks/use-start-card-scanning'
import { Flow } from '../types'

export type EidInsertCardScreenProps = {
  flow: Flow
  pin?: string
  newPin?: string
  can?: string
  onAuthSuccess: () => void
  onChangePinSuccess: () => void
  onPinRetry: () => void
  onCanRetry: () => void
  onPukRetry: () => void
  onClose: () => void
}

export const EidInsertCardScreen: React.FC<EidInsertCardScreenProps> = ({
  onAuthSuccess,
  onChangePinSuccess,
  onPinRetry,
  onCanRetry,
  onPukRetry,
  onClose,
  flow,
  pin,
  newPin,
  can,
}) => {
  const { buildTestId } = useTestIdBuilder()

  const { isLoading, startScanning } = useStartCardScanning({
    flow,
    onAuthSuccess,
    onChangePinSuccess,
    pin,
    newPin,
    can,
    onPinRetry,
    onCanRetry,
    onPukRetry,
  })

  return (
    <ModalScreen whiteBottom testID={buildTestId('eid_insertCard')}>
      <ModalScreenHeader
        testID={buildTestId('eid_insertCard_title')}
        titleI18nKey="eid_insertCard_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration i18nKey="eid_insertCard_image_alt" testID="eid_insertCard_image_alt" type="eid-scan" />
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={styles.contentTitle}
            testID={buildTestId('eid_insertCard_content_title')}
            i18nKey="eid_insertCard_content_title"
            textStyle="HeadlineH3Extrabold"
          />
          <TranslatedText
            textStyleOverrides={styles.contentText}
            testID={buildTestId('eid_insertCard_content_text')}
            i18nKey="eid_insertCard_content_text"
            textStyle="BodyRegular"
          />
          <LinkText link="https://www.sap.de" i18nKey="eid_insertCard_faq_link" textStyle="BodyRegular" />
        </View>
      </ScrollView>
      <View style={styles.buttonFooter}>
        <Button
          onPress={startScanning}
          variant="primary"
          disabled={isLoading}
          testID={buildTestId('eid_insertCard_start_button')}
          i18nKey="eid_insertCard_start_button"
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
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[7],
  },
  contentTitle: {
    paddingTop: spacing[7],
    flexWrap: 'wrap',
    color: colors.moonDarkest,
  },
  contentText: {
    paddingVertical: spacing[6],
    flexWrap: 'wrap',
    color: colors.moonDarkest,
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
