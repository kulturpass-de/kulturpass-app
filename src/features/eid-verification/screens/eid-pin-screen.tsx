import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '../../../components/button/button'
import { FormFieldWithControl } from '../../../components/form-fields/form-field-with-control'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { AboutPinLinkSection } from '../components/about-pin-link-section'
import { EidButtonFooter } from '../components/eid-button-footer'
import { PinInput } from '../components/pin-input'
import { usePinFormValidation } from '../hooks/use-pin-form-validation'

export type EidPinScreenProps = {
  onNext: (pin: string) => void
  onChangePin: () => void
  onClose: () => void
  retryCounter?: number
}

const PIN_LENGTH = 6

export const EidPinScreen: React.FC<EidPinScreenProps> = ({ onNext, onChangePin, onClose, retryCounter }) => {
  const { buildTestId } = useTestIdBuilder()

  const { form, onPressSubmit } = usePinFormValidation(3, PIN_LENGTH, onNext, retryCounter)

  return (
    <ModalScreen whiteBottom testID={buildTestId('eid_pinView')}>
      <ModalScreenHeader
        testID={buildTestId('eid_pinView_title')}
        titleI18nKey="eid_pinView_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={styles.contentTitle}
            testID={buildTestId('eid_pinView_content_title')}
            i18nKey="eid_pinView_content_title"
            textStyle="HeadlineH4Extrabold"
          />
          <TranslatedText
            testID={buildTestId('eid_pinView_content_text')}
            i18nKey="eid_pinView_content_text"
            textStyle="BodyRegular"
            textStyleOverrides={{ color: colors.moonDarkest }}
          />
          <View style={styles.pinView}>
            <FormFieldWithControl
              testID={buildTestId('eid_pinView_pin_input')}
              name="pin"
              variant="pin"
              control={form.control}
              component={PinInput}
              pinLength={PIN_LENGTH}
            />
          </View>
          <TranslatedText
            testID={buildTestId('eid_pinView_notChanged_text')}
            i18nKey="eid_pinView_notChanged_text"
            textStyle="BodyRegular"
            textStyleOverrides={{ color: colors.moonDarkest }}
          />
          <View style={styles.changePinButton}>
            <Button
              testID={buildTestId('eid_pinView_changeHere_button')}
              i18nKey="eid_pinView_changeHere_button"
              variant="tertiary"
              widthOption="content"
              modifier="small"
              iconSource="ArrowForward"
              onPress={onChangePin}
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
  contentTitle: {
    paddingTop: spacing[6],
    paddingBottom: spacing[2],
    flexWrap: 'wrap',
    color: colors.moonDarkest,
  },
  pinView: {
    paddingTop: spacing[9],
    paddingBottom: spacing[13],
    paddingHorizontal: spacing[5],
  },
  changePinButton: {
    paddingVertical: spacing[4],
    justifyContent: 'flex-start',
    flexGrow: 1,
    marginBottom: 65,
  },
})
