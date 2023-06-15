import React, { useCallback } from 'react'
import { Pressable, StyleSheet, Text, TextStyle } from 'react-native'

import { useTestIdBuilder } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'
import { Icon } from '../icon/icon'
import { TranslatedText, TranslatedTextProps } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'
import { openLink } from '../../utils/links/utils'
import { useTranslation } from '../../services/translation/translation'
import { spacing } from '../../theme/spacing'

type LinkTextInlineProps = {
  link: string
  i18nKey: AvailableTranslations
  style?: TextStyle
  iconSize?: number
  textStyle?: TranslatedTextProps['textStyle']
}

export const LinkTextInline: React.FC<LinkTextInlineProps> = ({ link, i18nKey, iconSize = 24, textStyle, style }) => {
  const { buildTestId } = useTestIdBuilder()
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
        <Icon width={iconSize} height={iconSize} source="LinkArrow" style={styles.icon} />
        <TranslatedText
          testID={linkTestId}
          textStyleOverrides={styles.text}
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
    color: colors.moonDarkest,
    textDecorationLine: 'underline',
  },
})
