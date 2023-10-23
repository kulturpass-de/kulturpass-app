import React, { ReactNode, useMemo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { LinkText } from '../../../components/link-text/link-text'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { ErrorWithCode } from '../../../services/errors/errors'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { ScanInProgressModal } from '../components/scan-in-progress-modal'
import { useStartCardScanning } from '../hooks/use-start-card-scanning'
import { Flow } from '../types'

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
  const { colors } = useTheme()

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

  const illustrationAltI18nKey: AvailableTranslations =
    Platform.OS === 'ios' ? 'eid_cardPositioning_ios_image_alt' : 'eid_cardPositioning_android_image_alt'

  return (
    <ModalScreen whiteBottom testID={buildTestId('eid_insertCard')}>
      {loadingModal}
      <ModalScreenHeader
        testID={buildTestId('eid_insertCard_title')}
        titleI18nKey="eid_insertCard_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration
          i18nKey={illustrationAltI18nKey}
          testID={illustrationAltI18nKey}
          type={Platform.OS === 'ios' ? 'eid-card-positioning-ios' : 'eid-card-positioning-android'}
        />
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
            testID={buildTestId('eid_insertCard_content_title')}
            i18nKey="eid_insertCard_content_title"
            textStyle="HeadlineH3Extrabold"
          />
          <TranslatedText
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
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
  },
  contentText: {
    paddingVertical: spacing[6],
    flexWrap: 'wrap',
  },
})
