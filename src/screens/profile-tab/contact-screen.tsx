import React from 'react'

import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { useTranslation } from '../../services/translation/translation'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { ScrollView, StyleSheet, View } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { SvgImage } from '../../components/svg-image/svg-image'
import { EMailLink } from '../../components/e-mail-link/e-mail-link'

export type ContactScreenProps = {
  onPressBackButton?: () => void
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ onPressBackButton }) => {
  const { t } = useTranslation()
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()

  const SCREEN_TEST_ID = buildTestId('contact')

  return (
    <Screen
      testID={SCREEN_TEST_ID}
      header={
        <ScreenHeader
          title={t('contact_title')}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'title')}
          onPressBack={onPressBackButton}
          screenType="subscreen"
        />
      }>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.image}>
          <SvgImage type="e-mail" screenWidthRelativeSize={0.26} />
        </View>
        <TranslatedText
          i18nKey="contact_content_contact_title"
          testID={addTestIdModifier(SCREEN_TEST_ID, 'content_contact_title')}
          textStyle="HeadlineH4Bold"
          textStyleOverrides={styles.title}
        />
        <TranslatedText
          i18nKey="contact_content_contact_text"
          testID={addTestIdModifier(SCREEN_TEST_ID, 'content_contact_text')}
          textStyle="BodyRegular"
          textStyleOverrides={styles.text}
        />
        <EMailLink
          testID={addTestIdModifier(SCREEN_TEST_ID, 'content_contact_email_recipient')}
          recipient={t('contact_content_contact_email_recipient')}
          subject={t('contact_content_contact_email_subject')}
        />
        <TranslatedText
          i18nKey="contact_content_report_title"
          testID={addTestIdModifier(SCREEN_TEST_ID, 'content_report_title')}
          textStyle="HeadlineH4Bold"
          textStyleOverrides={styles.title}
        />
        <TranslatedText
          i18nKey="contact_content_report_text"
          testID={addTestIdModifier(SCREEN_TEST_ID, 'content_report_text')}
          textStyle="BodyRegular"
          textStyleOverrides={styles.text}
        />
        <EMailLink
          testID={addTestIdModifier(SCREEN_TEST_ID, 'content_report_email_recipient')}
          recipient={t('contact_content_report_email_recipient')}
          subject={t('contact_content_report_email_subject')}
        />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[5],
  },
  title: {
    paddingTop: spacing[8],
    color: colors.moonDarkest,
  },
  text: {
    paddingVertical: spacing[5],
    color: colors.moonDarkest,
  },
})
