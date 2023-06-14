import React, { ReactNode, useMemo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
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
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ScanInProgressModal } from '../components/scan-in-progress-modal'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { ErrorWithCode } from '../../../services/errors/errors'

export type EidInsertCardScreenProps = {
  flow: Flow
  pin?: string
  newPin?: string
  can?: string
  puk?: string
  errorModalVisible: boolean
  onAuthSuccess: () => void
  onChangePinSuccess: () => void
  onPinRetry: (retryCounter?: number | undefined) => void
  onCanRetry: (canRetry: boolean) => void
  onPukRetry: (pukRetry: boolean) => void
  onError: (error: ErrorWithCode) => void
  onClose: () => void
}

export const EidInsertCardScreen: React.FC<EidInsertCardScreenProps> = ({
  onAuthSuccess,
  onChangePinSuccess,
  onPinRetry,
  onCanRetry,
  onPukRetry,
  onError,
  onClose,
  flow,
  pin,
  newPin,
  can,
  puk,
  errorModalVisible,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const eidGeneralFaqLink = useFaqLink('EID_IDENTIFICATION_GENERAL')

  const { isLoading, startScanning } = useStartCardScanning({
    flow,
    onAuthSuccess,
    onChangePinSuccess,
    pin,
    newPin,
    can,
    puk,
    onPinRetry,
    onCanRetry,
    onPukRetry,
    onError,
  })

  const loadingModal: ReactNode = useMemo(() => {
    if (!errorModalVisible && isLoading) {
      return Platform.OS === 'android' ? (
        <ScanInProgressModal scanning={isLoading} />
      ) : (
        <LoadingIndicator loading={isLoading} />
      )
    } else {
      return null
    }
  }, [errorModalVisible, isLoading])

  return (
    <ModalScreen whiteBottom testID={buildTestId('eid_insertCard')}>
      {loadingModal}
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
            i18nKey={Platform.OS === 'ios' ? 'eid_insertCard_content_text_ios' : 'eid_insertCard_content_text_android'}
            textStyle="BodyRegular"
          />
          <LinkText
            link={eidGeneralFaqLink}
            testID={buildTestId('eid_insertCard_faq_link')}
            i18nKey="eid_insertCard_faq_link"
            textStyle="BodyRegular"
          />
        </View>
      </ScrollView>
      <ModalScreenFooter>
        <Button
          onPress={startScanning}
          variant="primary"
          disabled={isLoading}
          testID={buildTestId('eid_insertCard_start_button')}
          i18nKey="eid_insertCard_start_button"
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
})
