import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Alert } from '../../../components/alert/alert'
import { AlertContent } from '../../../components/alert/alert-content'
import { AlertTitle } from '../../../components/alert/alert-title'
import { Button } from '../../../components/button/button'
import { LinkText } from '../../../components/link-text/link-text'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { useCancelFlow } from '../hooks/use-cancel-flow'
import { LoadingIndicatorOverlay } from '../../../components/loading-indicator/loading-indicator-overlay'
import { useDebouncedLoading } from '../../../components/loading-indicator/use-debounced-loading'

export type CancelEidFlowAlertProps = {
  visible: boolean
  onChange: (visible: boolean) => void
}

export const CancelEidFlowAlert: React.FC<CancelEidFlowAlertProps> = ({ visible, onChange }) => {
  const { buildTestId } = useTestIdBuilder()
  const modalNavigation = useModalNavigation()

  const [isLoading, setIsLoading] = useState(false)

  const debouncedLoading = useDebouncedLoading(isLoading)

  const cancelFlow = useCancelFlow()

  const handleResume = useCallback(() => {
    onChange(false)
  }, [onChange])

  const handleCancel = useCallback(async () => {
    setIsLoading(true)
    await cancelFlow()
    modalNavigation.closeModal()
    onChange(false)
    setIsLoading(false)
  }, [cancelFlow, modalNavigation, onChange])

  return (
    <Alert visible={visible} onChange={onChange}>
      <AlertContent style={styles.container}>
        <AlertTitle testID={buildTestId('eid_cancel_flow_title')} i18nKey="eid_cancel_flow_title" />
        <TranslatedText
          textStyleOverrides={styles.text}
          i18nKey="eid_cancel_flow_text"
          testID={buildTestId('eid_cancel_flow_text')}
          textStyle="BodyRegular"
        />
        <View style={styles.linkContainer}>
          <LinkText
            i18nKey="eid_cancel_flow_resetPin_link"
            link="https://www.sap.de"
            textStyle="BodyMedium"
            flex={false}
          />
        </View>
        <Button
          testID={buildTestId('eid_cancel_flow_resume_button')}
          i18nKey="eid_cancel_flow_resume_button"
          variant="primary"
          disabled={isLoading}
          onPress={handleResume}
        />
        <Button
          testID={buildTestId('eid_cancel_flow_cancel_button')}
          i18nKey="eid_cancel_flow_cancel_button"
          variant="white"
          disabled={isLoading}
          onPress={handleCancel}
        />
      </AlertContent>
      {debouncedLoading ? <LoadingIndicatorOverlay /> : null}
    </Alert>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignContent: 'center',
  },
  text: {
    flexWrap: 'wrap',
    textAlign: 'center',
    color: colors.moonDarkest,
  },
  linkContainer: {
    paddingTop: spacing[7],
    paddingBottom: spacing[6],
  },
})
