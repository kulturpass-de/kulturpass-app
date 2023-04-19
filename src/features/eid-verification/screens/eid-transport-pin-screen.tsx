import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

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
import { usePinFormValidation } from '../components/use-pin-form-validation'

export type EidTransportPinScreenProps = {
  onNext: (transportPin: string) => void
  onClose: () => void
  retryCounter?: number
}

const PIN_LENGTH = 5

export const EidTransportPinScreen: React.FC<EidTransportPinScreenProps> = ({ onNext, onClose, retryCounter }) => {
  const { buildTestId } = useTestIdBuilder()

  const { form, onPressSubmit } = usePinFormValidation(3, PIN_LENGTH, onNext, retryCounter)

  return (
    <ModalScreen whiteBottom testID={buildTestId('eid_transportPinView')}>
      <ModalScreenHeader
        testID={buildTestId('eid_transportPinView_title')}
        titleI18nKey="eid_transportPinView_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={styles.contentText}
            testID={buildTestId('eid_transportPinView_content_text')}
            i18nKey="eid_transportPinView_content_text"
            textStyle="BodyRegular"
          />
          <TranslatedText
            testID={buildTestId('eid_transportPinView_transportPin_title')}
            i18nKey="eid_transportPinView_transportPin_title"
            textStyle="HeadlineH4Extrabold"
            textStyleOverrides={{ color: colors.moonDarkest }}
          />
          <View style={styles.transportPinView}>
            <FormFieldWithControl
              testID={buildTestId('eid_transportPinView_transportPin_input')}
              name="pin"
              control={form.control}
              component={PinInput}
              pinLength={PIN_LENGTH}
            />
          </View>
          <AboutPinLinkSection showResetPin type="pin" />
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
  contentText: {
    paddingVertical: spacing[6],
    flexWrap: 'wrap',
    color: colors.moonDarkest,
  },
  transportPinView: {
    paddingTop: spacing[9],
    paddingBottom: spacing[13],
  },
})
