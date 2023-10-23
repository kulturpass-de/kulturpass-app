import React from 'react'
import { Pressable, StyleSheet, TextStyle, View } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'
import { SvgImage, SvgImageProps } from '../svg-image/svg-image'
import { TranslatedText, TranslatedTextProps } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'

type TextWithIconProps = {
  onPress: () => void
  i18nKey: AvailableTranslations
  style?: TextStyle
  iconSize?: number
  iconType: SvgImageProps['type']
  textStyle?: TranslatedTextProps['textStyle']
  textStyleOverrides?: TranslatedTextProps['textStyleOverrides']
}

export const TextWithIcon: React.FC<TextWithIconProps> = ({
  onPress,
  i18nKey,
  iconSize = 22,
  iconType,
  textStyle,
  textStyleOverrides,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  const testID = buildTestId(i18nKey)

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessible>
      <View style={styles.container}>
        <SvgImage width={iconSize} height={iconSize} type={iconType} style={styles.icon} />

        <TranslatedText
          testID={testID}
          textStyleOverrides={[styles.text, { color: colors.labelColor }, textStyleOverrides]}
          textStyle={textStyle ?? 'BodySmallMedium'}
          i18nKey={i18nKey}
        />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    flexWrap: 'wrap',
    textDecorationLine: 'underline',
  },
})
