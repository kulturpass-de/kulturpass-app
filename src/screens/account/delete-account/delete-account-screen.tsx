import React, { useCallback } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { LinkText } from '../../../components/link-text/link-text'
import { Screen } from '../../../components/screen/screen'
import { ScreenHeader } from '../../../components/screen/screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { addTestIdModifier, useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { AccountDeletionConfirmRouteName } from './account-deletion-confirm-route'

export type DeleteAccountScreenProps = {
  onPressBackButton?: () => void
}

export const DeleteAccountScreen: React.FC<DeleteAccountScreenProps> = ({ onPressBackButton }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { buildTestId } = useTestIdBuilder()
  const deleteAccountFaqLink = useFaqLink('ACCOUNT_DELETE')
  const modalNavigation = useModalNavigation()

  const onNext = useCallback(() => {
    modalNavigation.navigate({
      screen: AccountDeletionConfirmRouteName,
    })
  }, [modalNavigation])

  const SCREEN_TEST_ID = buildTestId('deleteAccount')

  return (
    <Screen
      testID={SCREEN_TEST_ID}
      header={
        <ScreenHeader
          testID={addTestIdModifier(SCREEN_TEST_ID, 'screen_title')}
          title={t('deleteAccount_title')}
          screenType="subscreen"
          onPressBack={onPressBackButton}
        />
      }>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Illustration testID={buildTestId('stopSign_image_alt')} i18nKey="stopSign_image_alt" type="delete-account" />
        <View style={styles.contentContainer}>
          <TranslatedText
            i18nKey="deleteAccount_content_title"
            testID={addTestIdModifier(SCREEN_TEST_ID, 'content_title')}
            textStyle="HeadlineH3Extrabold"
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
          />
          <TranslatedText
            i18nKey="deleteAccount_content_text_first"
            testID={addTestIdModifier(SCREEN_TEST_ID, 'content_text_first')}
            textStyle="BodyRegular"
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
          />
          <TranslatedText
            i18nKey="deleteAccount_content_text_second"
            testID={addTestIdModifier(SCREEN_TEST_ID, 'content_text_second')}
            textStyle="BodyRegular"
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
          />
          <View style={styles.spacerSecond} />
          <LinkText
            i18nKey="deleteAccount_content_link"
            testID={addTestIdModifier(SCREEN_TEST_ID, 'content_link')}
            link={deleteAccountFaqLink}
          />
          <View style={styles.spacer} />
          <Button
            i18nKey="deleteAccount_next_button"
            testID={addTestIdModifier(SCREEN_TEST_ID, 'next_button')}
            variant="error"
            onPress={onNext}
          />
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scrollContentContainer: {
    flexDirection: 'column',
  },
  contentTitle: {
    paddingTop: spacing[6],
    paddingBottom: spacing[2],
  },
  contentText: {
    paddingTop: spacing[6],
  },
  spacer: {
    minHeight: spacing[6],
    flexGrow: 1,
  },
  spacerSecond: {
    height: spacing[7],
  },
  contentContainer: {
    paddingHorizontal: spacing[8],
    flexDirection: 'column',
    paddingBottom: spacing[6],
  },
})
