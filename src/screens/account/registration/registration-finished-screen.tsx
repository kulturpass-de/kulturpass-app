import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { selectIdentificationDisabled } from '../../../services/redux/slices/persisted-app-core'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export type RegistrationFinishedScreenProps = {
  onNext: () => void
  onClose: () => void
}

export const RegistrationFinishedScreen: React.FC<RegistrationFinishedScreenProps> = ({ onNext, onClose }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()
  const identificationDisabled = useSelector(selectIdentificationDisabled)
  const screenTestID = buildTestId('registration_finished')

  return (
    <ModalScreen whiteBottom testID={screenTestID}>
      <ModalScreenHeader
        testID={addTestIdModifier(screenTestID, 'headline_title')}
        titleI18nKey="registration_finished_headline_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration
          type="registration-finished"
          testID={addTestIdModifier(screenTestID, 'image')}
          i18nKey="registration_finished_image_alt"
        />
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestID, 'content_title')}
            i18nKey="registration_finished_content_title"
            textStyle="HeadlineH3Extrabold"
          />
          {identificationDisabled ? (
            <TranslatedText
              textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
              testID={addTestIdModifier(screenTestID, 'content_text_identification_disabled')}
              i18nKey="registration_finished_content_text_identification_disabled"
              textStyle="BodyRegular"
            />
          ) : (
            <>
              <TranslatedText
                textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
                testID={addTestIdModifier(screenTestID, 'content_text_first')}
                i18nKey="registration_finished_content_text_first"
                textStyle="BodyRegular"
              />
              <TranslatedText
                textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
                testID={addTestIdModifier(screenTestID, 'content_text_second')}
                i18nKey="registration_finished_content_text_second"
                textStyle="BodyRegular"
              />
            </>
          )}
        </View>
      </ScrollView>
      <ModalScreenFooter>
        {!identificationDisabled ? (
          <Button
            onPress={onNext}
            variant="primary"
            testID={addTestIdModifier(screenTestID, 'nextButton')}
            i18nKey="registration_finished_nextButton"
          />
        ) : null}
        <Button
          onPress={onClose}
          variant={identificationDisabled ? 'primary' : 'white'}
          testID={addTestIdModifier(screenTestID, 'closeButton')}
          i18nKey={
            identificationDisabled
              ? 'registration_finished_closeButton_identification_disabled'
              : 'registration_finished_closeButton'
          }
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
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
    flexDirection: 'column',
  },
  contentTitle: {
    paddingTop: spacing[7],
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  contentText: {
    paddingTop: spacing[6],
    flexWrap: 'wrap',
    textAlign: 'center',
  },
})
