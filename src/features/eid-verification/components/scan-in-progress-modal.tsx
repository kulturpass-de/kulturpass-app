import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import { AlertBackdrop } from '../../../components/alert/alert-backdrop'
import { AlertContent } from '../../../components/alert/alert-content'
import { LoadingAnimation } from '../../../components/loading-animation/loading-animation'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import useAccessibilityFocus from '../../../navigation/a11y/use-accessibility-focus'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'

export type ScanInProgressModalProps = {
  scanning: boolean
}
export const ScanInProgressModal: React.FC<ScanInProgressModalProps> = ({ scanning }) => {
  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  return (
    <Modal animationType="none" presentationStyle="overFullScreen" transparent={true} visible={scanning}>
      <View style={styles.container}>
        <AlertBackdrop />
        <AlertContent ref={focusRef}>
          <TranslatedText
            textStyleOverrides={styles.title}
            i18nKey="eid_insertCard_android_scanModal_title"
            textStyle="HeadlineH3Extrabold"
          />
          <TranslatedText
            textStyleOverrides={styles.text}
            i18nKey="eid_insertCard_android_scanModal_text"
            textStyle="BodyRegular"
          />
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
    backgroundColor: '#39393957',
  },
  title: {
    color: colors.moonDarkest,
  },
  text: {
    paddingTop: spacing[3],
    paddingBottom: spacing[6],
    color: colors.moonDarkest,
  },
})
