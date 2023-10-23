import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import { AlertBackdrop } from '../../../components/alert/alert-backdrop'
import { AlertContent } from '../../../components/alert/alert-content'
import { AlertMessage } from '../../../components/alert/alert-message'
import { AlertTitle } from '../../../components/alert/alert-title'
import { LoadingAnimation } from '../../../components/loading-animation/loading-animation'
import useAccessibilityFocus from '../../../navigation/a11y/use-accessibility-focus'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { spacing } from '../../../theme/spacing'

export type ScanInProgressModalProps = {
  scanning: boolean
}
export const ScanInProgressModal: React.FC<ScanInProgressModalProps> = ({ scanning }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const testID = buildTestId('scan_in_progress_modal')
  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  return (
    <Modal animationType="none" presentationStyle="overFullScreen" transparent={true} visible={scanning}>
      <View style={styles.container}>
        <AlertBackdrop />
        <AlertContent ref={focusRef}>
          <AlertTitle testID={addTestIdModifier(testID, 'title')} i18nKey="eid_insertCard_android_scanModal_title" />
          <AlertMessage testID={addTestIdModifier(testID, 'message')} i18nKey="eid_insertCard_android_scanModal_text" />
          <LoadingAnimation />
        </AlertContent>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
  },
})
