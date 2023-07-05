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
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'

export type AccountDeletionSuccessfulScreenProps = {
  onClose: () => void
}

export const AccountDeletionSuccessfulScreen: React.FC<AccountDeletionSuccessfulScreenProps> = ({ onClose }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()

  const screenTestId = buildTestId('accountDeletion_successful')

  return (
    <ModalScreen whiteBottom testID={screenTestId}>
      <ModalScreenHeader
        testID={addTestIdModifier(screenTestId, 'title')}
        titleI18nKey="accountDeletion_successful_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration
          i18nKey="success_image_alt"
          testID={buildTestId('accountDeletion_successful_image')}
          type="success"
        />
        <View style={styles.contentTitleContainer}>
          <TranslatedText
            textStyleOverrides={styles.contentTitle}
            testID={addTestIdModifier(screenTestId, 'content_title')}
            i18nKey="accountDeletion_successful_content_title"
            textStyle="HeadlineH3Extrabold"
          />
          <TranslatedText
            textStyleOverrides={styles.contentText}
            testID={addTestIdModifier(screenTestId, 'content_text')}
            i18nKey="accountDeletion_successful_content_text"
            textStyle="BodyRegular"
          />
        </View>
      </ScrollView>
      <ModalScreenFooter>
        <Button
          onPress={onClose}
          variant="primary"
          testID={addTestIdModifier(screenTestId, 'done_button')}
          i18nKey="accountDeletion_successful_done_button"
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
    flexDirection: 'column',
    paddingHorizontal: spacing[5],
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
})
