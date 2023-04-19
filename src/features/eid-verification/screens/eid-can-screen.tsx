import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { z } from 'zod'

import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { PinInput } from '../components/pin-input'
import { FormFieldWithControl } from '../../../components/form-fields/form-field-with-control'
import { AboutPinLinkSection } from '../components/about-pin-link-section'
import { EidButtonFooter } from '../components/eid-button-footer'

export type EidCanScreenProps = {
  onNext: (can: string) => void
  onClose: () => void
}

export const EidCanScreen: React.FC<EidCanScreenProps> = ({ onNext, onClose }) => {
  const { buildTestId } = useTestIdBuilder()

  const form = useForm<{ can: string }>({
    resolver: zodResolver(
      z.object({
        can: z.string().min(6).max(6),
      }),
    ),
  })

  const onPressSubmit = form.handleSubmit(async values => {
    onNext(values.can)
  })

  return (
    <ModalScreen whiteBottom testID={buildTestId('eid_canView')}>
      <ModalScreenHeader
        testID={buildTestId('eid_canView_title')}
        titleI18nKey="eid_canView_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={styles.contentTitle}
            testID={buildTestId('eid_canView_content_title')}
            i18nKey="eid_canView_content_title"
            textStyle="HeadlineH4Extrabold"
          />
          <TranslatedText
            testID={buildTestId('eid_canView_content_text')}
            i18nKey="eid_canView_content_text"
            textStyle="BodyRegular"
            textStyleOverrides={{ color: colors.moonDarkest }}
          />
          <View style={styles.canView}>
            <FormFieldWithControl
              testID={buildTestId('eid_pinView_can_input')}
              name="can"
              control={form.control}
              component={PinInput}
              pinLength={6}
            />
          </View>
          <AboutPinLinkSection type="can" showResetPin={false} />
        </View>
      </ScrollView>
      <EidButtonFooter onNext={onPressSubmit} onCancel={onClose} nextDisabled={!form.formState.isValid} />
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
    flexDirection: 'column',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
    flexGrow: 1,
  },
  contentTitle: {
    paddingTop: spacing[6],
    paddingBottom: spacing[2],
    flexWrap: 'wrap',
    color: colors.moonDarkest,
  },
  canView: {
    paddingTop: spacing[9],
    paddingBottom: spacing[13],
  },
})
