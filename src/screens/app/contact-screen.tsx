import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { EMailLink } from '../../components/e-mail-link/e-mail-link'
import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { SvgImage } from '../../components/svg-image/svg-image'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

export type ContactScreenProps = {
  onPressBackButton?: () => void
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ onPressBackButton }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
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
          textStyleOverrides={[styles.title, { color: colors.labelColor }]}
        />
        <TranslatedText
          i18nKey="contact_content_contact_text"
          testID={addTestIdModifier(SCREEN_TEST_ID, 'content_contact_text')}
          textStyle="BodyRegular"
          textStyleOverrides={[styles.text, { color: colors.labelColor }]}
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
          textStyleOverrides={[styles.title, { color: colors.labelColor }]}
        />
        <TranslatedText
          i18nKey="contact_content_report_text"
          testID={addTestIdModifier(SCREEN_TEST_ID, 'content_report_text')}
          textStyle="BodyRegular"
          textStyleOverrides={[styles.text, { color: colors.labelColor }]}
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
  },
  text: {
    paddingVertical: spacing[5],
  },
})
