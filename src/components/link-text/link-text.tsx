import React, { useCallback } from 'react'
import { Pressable, StyleSheet, TextStyle, View } from 'react-native'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { openLink } from '../../utils/links/utils'
import { Icon } from '../icon/icon'
import { TranslatedText, TranslatedTextProps } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'

type LinkTextProps = {
  link: string
  i18nKey: AvailableTranslations
  testID: TestId
  style?: TextStyle
  iconSize?: number
  textStyle?: TranslatedTextProps['textStyle']
  flex?: boolean
}

export const LinkText: React.FC<LinkTextProps> = ({
  link,
  i18nKey,
  testID,
  iconSize = 24,
  textStyle,
  style,
  flex = true,
}) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { t } = useTranslation()

  const handlePress = useCallback(() => openLink(link), [link])

  return (
    <View style={[styles.container, style]}>
      <Icon width={iconSize} height={iconSize} source="LinkArrow" />
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
          textStyleOverrides={styles.text}
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
    color: colors.moonDarkest,
    textDecorationLine: 'underline',
  },
})
