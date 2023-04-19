import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'

export type EidVerificationCompletionScreenProps = {
  onNext: () => void
}

export const EidVerificationCompletionScreen: React.FC<EidVerificationCompletionScreenProps> = ({ onNext }) => {
  const { buildTestId } = useTestIdBuilder()

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
            textStyleOverrides={styles.contentTitle}
            testID={buildTestId('eid_verificationCompletion_content_title')}
            i18nKey="eid_verificationCompletion_content_title"
            textStyle="HeadlineH3Extrabold"
          />
          <TranslatedText
            textStyleOverrides={styles.contentText}
            testID={buildTestId('eid_verificationCompletion_content_text')}
            i18nKey="eid_verificationCompletion_content_text"
            textStyle="BodyRegular"
          />
        </View>
      </ScrollView>
      <View style={styles.buttonFooter}>
        <Button
          onPress={onNext}
          variant="primary"
          testID={buildTestId('eid_verificationCompletion_accept_button')}
          i18nKey="eid_verificationCompletion_accept_button"
        />
      </View>
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
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginHorizontal: spacing[5],
    paddingBottom: spacing[6],
  },
  contentTitle: {
    paddingTop: spacing[7],
    flexWrap: 'wrap',
    textAlign: 'center',
    color: colors.basicBlack,
  },
  contentText: {
    paddingTop: spacing[6],
    flexWrap: 'wrap',
    textAlign: 'center',
    color: colors.moonDarkest,
  },
  buttonFooter: {
    padding: spacing[5],
    backgroundColor: colors.basicWhite,
    borderTopWidth: 2,
    borderTopColor: colors.basicBlack,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    height: 80,
  },
})
