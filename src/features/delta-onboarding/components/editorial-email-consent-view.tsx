import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { LinkText } from '../../../components/link-text/link-text'
import { ScreenContent } from '../../../components/screen/screen-content'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import {
  getCdcDpsDocumentUrl,
  useLocalizedEnvironmentUrl,
} from '../../../utils/links/hooks/use-localized-environment-url'

export type EditorialEmailContentViewProps = {
  description1I18nKey?: AvailableTranslations
}

export const EditorialEmailConsentView: React.FC<EditorialEmailContentViewProps> = ({
  description1I18nKey = 'editorial_email_consent_description_1',
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const testID = buildTestId('editorial_email_consent_view')
  const { t } = useTranslation()
  const { colors } = useTheme()
  const color = colors.labelColor

  const dpsDocumentUrl = useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl)

  return (
    <ScreenContent style={styles.container}>
      <SvgImage
        accessibilityLabel={t('editorial_email_consent_modal_image_alt')}
        style={styles.image}
        width={390}
        height={260}
        type="editorial-email-consent"
        testID={addTestIdModifier(testID, 'image')}
      />

      <TranslatedText
        i18nKey="editorial_email_consent_title"
        textStyle="HeadlineH3Extrabold"
        textStyleOverrides={[styles.title, { color }]}
        testID={addTestIdModifier(testID, 'title')}
      />

      <TranslatedText
        i18nKey={description1I18nKey}
        textStyle="BodyRegular"
        textStyleOverrides={[styles.text, { color }]}
        testID={addTestIdModifier(testID, 'description_1')}
      />

      <TranslatedText
        i18nKey="editorial_email_consent_description_2"
        textStyle="BodyRegular"
        textStyleOverrides={[styles.text, { color }]}
        testID={addTestIdModifier(testID, 'description_2')}
      />

      <TranslatedText
        i18nKey="editorial_email_consent_description_3"
        textStyle="BodyRegular"
        textStyleOverrides={[styles.lastText, { color }]}
        testID={addTestIdModifier(testID, 'description_3')}
      />

      <LinkText
        link={dpsDocumentUrl}
        i18nKey="editorial_email_link"
        textStyle="BodyMedium"
        testID={addTestIdModifier(testID, 'email_link')}
        style={styles.link}
      />
    </ScreenContent>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing[5] },
  image: {
    alignSelf: 'center',
    maxWidth: '100%',
  },
  title: {
    marginBottom: spacing[6],
  },
  text: {
    marginBottom: spacing[6],
  },
  lastText: {
    marginBottom: spacing[9],
  },
  link: {
    marginBottom: spacing[8],
  },
})
