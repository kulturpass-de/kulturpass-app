import React, { useCallback } from 'react'
import { Pressable, StyleSheet, Text, TextStyle } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { openLink } from '../../utils/links/utils'
import { SvgImage } from '../svg-image/svg-image'
import { TranslatedText, TranslatedTextProps } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'

type LinkTextInlineProps = {
  link: string
  i18nKey: AvailableTranslations
  style?: TextStyle
  iconSize?: number
  textStyle?: TranslatedTextProps['textStyle']
  textStyleOverrides?: TranslatedTextProps['textStyleOverrides']
}

export const LinkTextInline: React.FC<LinkTextInlineProps> = ({
  link,
  i18nKey,
  iconSize,
  textStyle,
  textStyleOverrides,
  style,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()
  const { t } = useTranslation()

  const handlePress = useCallback(() => openLink(link), [link])

  const linkTestId = buildTestId(i18nKey)

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityHint={t('external_link_short_accessibility_announcement')}
      accessibilityLabel={t(i18nKey)}
      accessible>
      <Text style={[styles.container, style]}>
        {iconSize !== undefined && (
          <SvgImage width={iconSize} height={iconSize} type="link-arrow" style={styles.icon} />
        )}
        <TranslatedText
          testID={linkTestId}
          textStyleOverrides={[styles.text, { color: colors.labelColor }, textStyleOverrides]}
          textStyle={textStyle ?? 'BodyRegular'}
          i18nKey={i18nKey}
        />
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  icon: {
    paddingTop: spacing[2],
  },
  text: {
    flexWrap: 'wrap',
    textDecorationLine: 'underline',
  },
})
