import React, { useCallback } from 'react'

import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { useTranslation } from '../../services/translation/translation'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { ScrollView, StyleSheet, View } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { Illustration } from '../../components/illustration/illustration'
import { LinkText } from '../../components/link-text/link-text'
import { Button } from '../../components/button/button'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { AccountDeletionConfirmRouteName } from '../../features/account-deletion/screens/account-deletion-confirm-route'

export type DeleteAccountScreenProps = {
  onPressBackButton?: () => void
}

export const DeleteAccountScreen: React.FC<DeleteAccountScreenProps> = ({ onPressBackButton }) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  const modalNavigation = useModalNavigation()

  const onNext = useCallback(() => {
    modalNavigation.navigate({
      screen: AccountDeletionConfirmRouteName,
    })
  }, [modalNavigation])

  return (
    <Screen
      testID={buildTestId('deleteAccount')}
      header={
        <ScreenHeader
          testID={buildTestId('deleteAccount_screen_title')}
          title={t('deleteAccount_title')}
          screenType="subscreen"
          onPressBack={onPressBackButton}
        />
      }>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Illustration testID={buildTestId('deleteAccount_image')} i18nKey="stopSign_image_alt" type="delete-account" />
        <View style={styles.contentContainer}>
          <TranslatedText
            testID={buildTestId('deleteAccount_content_title')}
            textStyle="HeadlineH3Extrabold"
            textStyleOverrides={styles.contentTitle}
            i18nKey="deleteAccount_content_title"
          />
          <TranslatedText
            testID={buildTestId('deleteAccount_content_text')}
            textStyle="BodyRegular"
            textStyleOverrides={styles.contentText}
            i18nKey="deleteAccount_content_text"
          />
          <LinkText i18nKey="deleteAccount_content_link" link="https://www.sap.de" />
          <View style={styles.spacer} />
          <Button i18nKey="deleteAccount_next_button" variant="error" onPress={onNext} />
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
    color: colors.moonDarkest,
  },
  contentText: {
    paddingVertical: spacing[7],
    color: colors.moonDarkest,
  },
  spacer: {
    minHeight: spacing[6],
    flexGrow: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing[8],
    flexDirection: 'column',
    paddingBottom: spacing[6],
  },
})
