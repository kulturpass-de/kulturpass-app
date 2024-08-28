import React, { useCallback } from 'react'
import { Pressable, StyleSheet, TextStyle, View } from 'react-native'
import { logger } from '../../services/logger'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { linkLogger, openLink } from '../../utils/links/utils'
import { SvgImage } from '../svg-image/svg-image'
import { TranslatedText, TranslatedTextProps } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'

type LinkTextProps = {
  link?: string
  i18nKey: AvailableTranslations
  testID: TestId
  style?: TextStyle
  iconSize?: number
  textStyle?: TranslatedTextProps['textStyle']
  flex?: boolean
  onPress?: () => void
}

export const LinkText: React.FC<LinkTextProps> = ({
  link,
  onPress,
  i18nKey,
  testID,
  iconSize = 24,
  textStyle,
  style,
  flex = true,
}) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()
  const { t } = useTranslation()

  const handlePress = useCallback(() => {
    if (onPress && link) {
      logger.warn('LinkText: Both onPress and link are provided. onPress will be ignored.')
    }
    if (link) {
      openLink(link).catch(linkLogger)
    } else if (onPress) {
      onPress()
    } else {
      logger.warn('LinkText: No link or onPress provided')
    }
  }, [link, onPress])

  return (
    <View style={[styles.container, style]}>
      <SvgImage width={iconSize} height={iconSize} type="link-arrow" />
      <Pressable
        style={[styles.textPadding, flex ? styles.textFlex : undefined]}
        onPress={handlePress}
        accessibilityRole={'link'}
        accessibilityHint={t('external_link_short_accessibility_announcement')}
        accessibilityLabel={t(i18nKey)}
        accessible
        testID={addTestIdModifier(testID, 'button')}>
        <TranslatedText
          testID={testID}
          textStyleOverrides={[styles.text, { color: colors.labelColor }]}
          textStyle={textStyle ?? 'BodyRegular'}
          i18nKey={i18nKey}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textPadding: {
    paddingLeft: 6,
  },
  textFlex: {
    flex: 1,
  },
  text: {
    flexWrap: 'wrap',
    textDecorationLine: 'underline',
  },
})
