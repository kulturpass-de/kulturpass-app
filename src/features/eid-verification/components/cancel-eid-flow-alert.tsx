import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { Alert } from '../../../components/alert/alert'
import { AlertContent } from '../../../components/alert/alert-content'
import { AlertTitle } from '../../../components/alert/alert-title'
import { Button } from '../../../components/button/button'
import { LinkText } from '../../../components/link-text/link-text'
import { LoadingIndicatorOverlay } from '../../../components/loading-indicator/loading-indicator-overlay'
import { useDebouncedLoading } from '../../../components/loading-indicator/use-debounced-loading'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import useAccessibilityFocus from '../../../navigation/a11y/use-accessibility-focus'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { useCloseFlow } from '../hooks/use-close-flow'

export type CancelEidFlowAlertProps = {
  visible: boolean
  onChange: (visible: boolean) => void
}

export const CancelEidFlowAlert: React.FC<CancelEidFlowAlertProps> = ({ visible, onChange }) => {
  const { buildTestId } = useTestIdBuilder()
  const resetPinFaqLink = useFaqLink('EID_PIN_RESET')
  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  const { closeFlow, loading } = useCloseFlow()
  //TODO: Refactor loading and debouncedLoading
  const debouncedLoading = useDebouncedLoading(loading)

  const handleResume = useCallback(() => {
    onChange(false)
  }, [onChange])

  const handleCancel = useCallback(async () => {
    await closeFlow()
    onChange(false)
  }, [closeFlow, onChange])

  return (
    <Alert visible={visible} onChange={onChange}>
      <AlertContent ref={focusRef} style={styles.container}>
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
            testID={buildTestId('eid_cancel_flow_resetPin_link')}
            link={resetPinFaqLink}
            textStyle="BodyMedium"
            flex={false}
          />
        </View>
        <Button
          testID={buildTestId('eid_cancel_flow_resume_button')}
          i18nKey="eid_cancel_flow_resume_button"
          variant="primary"
          disabled={loading}
          onPress={handleResume}
        />
        <Button
          testID={buildTestId('eid_cancel_flow_cancel_button')}
          i18nKey="eid_cancel_flow_cancel_button"
          variant="white"
          disabled={loading}
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
