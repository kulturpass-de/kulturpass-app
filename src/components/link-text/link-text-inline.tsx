import React, { useCallback } from 'react'
import { StyleSheet, Text, TextStyle } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'
import { Icon } from '../icon/icon'
import { TranslatedText, TranslatedTextProps } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'
import { openLink } from '../../utils/links/utils'
import { useTranslation } from '../../services/translation/translation'

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
    <Text
      style={[styles.container, style]}
      suppressHighlighting={true}
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityLabel={t(i18nKey)}
      accessible
      testID={linkTestId + '_button'}>
      <Icon width={iconSize} height={iconSize} source="LinkArrow" />{' '}
      <TranslatedText
        testID={linkTestId}
        textStyleOverrides={styles.text}
        textStyle={textStyle ?? 'BodyRegular'}
        i18nKey={i18nKey}
      />
    </Text>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  text: {
    flexWrap: 'wrap',
    color: colors.moonDarkest,
    textDecorationLine: 'underline',
  },
})
