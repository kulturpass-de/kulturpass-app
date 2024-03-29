import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export type EidVerificationCompletionScreenProps = {
  onNext: () => void
}

export const EidVerificationCompletionScreen: React.FC<EidVerificationCompletionScreenProps> = ({ onNext }) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  return (
    <ModalScreen whiteBottom testID={buildTestId('eid_verificationCompletion')}>
      <ModalScreenHeader
        testID={buildTestId('eid_verificationCompletion_title')}
        titleI18nKey="eid_verificationCompletion_title"
        onPressClose={onNext}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration
          i18nKey="eid_verificationCompletion_image_alt"
          testID={buildTestId('eid_verificationCompletion_image')}
          type="budget-received"
        />
        <View style={styles.contentTitleContainer}>
          <TranslatedText
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
            testID={buildTestId('eid_verificationCompletion_content_title')}
            i18nKey="eid_verificationCompletion_content_title"
            textStyle="HeadlineH3Extrabold"
          />
          <TranslatedText
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
            testID={buildTestId('eid_verificationCompletion_content_text')}
            i18nKey="eid_verificationCompletion_content_text"
            textStyle="BodyRegular"
          />
        </View>
      </ScrollView>
      <ModalScreenFooter>
        <Button
          onPress={onNext}
          variant="primary"
          testID={buildTestId('eid_verificationCompletion_accept_button')}
          i18nKey="eid_verificationCompletion_accept_button"
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
  contentTitleContainer: {
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
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
