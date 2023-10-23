import React, { forwardRef } from 'react'
import { StyleSheet, Text, type StyleProp, type TextStyle, AccessibilityProps } from 'react-native'
import { TestId } from '../../services/test-id/test-id'
import { useTranslation, Trans } from '../../services/translation/translation'
import { textStyles } from '../../theme/typography'
import { applyAccessibilityReplacements } from './accessibility-replacements'
import { AvailableTextStyles, AvailableTranslations } from './types'

export type TranslatedTextProps = {
  i18nKey: AvailableTranslations
  i18nParams?: {}
  textStyle: AvailableTextStyles
  textStyleOverrides?: StyleProp<TextStyle>
  testID?: TestId
  customComponents?: Record<string, JSX.Element>
  accessibilityRole?: AccessibilityProps['accessibilityRole']
}

export const TranslatedText = forwardRef<Text, TranslatedTextProps>(
  (
    { i18nKey, i18nParams, textStyle, textStyleOverrides = {}, testID, customComponents, accessibilityRole = 'text' },
    ref: React.ForwardedRef<Text>,
  ) => {
    const { t } = useTranslation()
    let accessibilityLabel = i18nParams ? t(i18nKey, i18nParams) : t(i18nKey)
    accessibilityLabel = applyAccessibilityReplacements(accessibilityLabel)

    return (
      <Text
        ref={ref}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessible
        accessibilityRole={accessibilityRole}
        style={[styles.base, textStyles[textStyle], textStyleOverrides]}>
        <Trans i18nKey={i18nKey as any} values={i18nParams} components={{ ...components, ...customComponents }} />
      </Text>
    )
  },
)

const styles = StyleSheet.create({
  base: {
    flexShrink: 1, // wraps the text automatically
  },
  extralight: { fontWeight: '200' },
  extralightitalic: { fontWeight: '200', fontStyle: 'italic' },
  light: { fontWeight: '300' },
  lightitalic: { fontWeight: '300', fontStyle: 'italic' },
  regular: { fontWeight: '400' },
  italic: { fontWeight: '400', fontStyle: 'italic' },
  medium: { fontWeight: '500' },
  mediumitalic: { fontWeight: '500', fontStyle: 'italic' },
  semibold: { fontWeight: '600' },
  semibolditalic: { fontWeight: '600', fontStyle: 'italic' },
  bold: { fontWeight: '700' },
  bolditalic: { fontWeight: '700', fontStyle: 'italic' },
  extrabold: { fontWeight: '800' },
  extrabolditalic: { fontWeight: '800', fontStyle: 'italic' },
  black: { fontWeight: '900' },
  blackitalic: { fontWeight: '900', fontStyle: 'italic' },
})

const components = {
  extralight: <Text style={styles.extralight} />,
  extralightitalic: <Text style={styles.extralightitalic} />,
  light: <Text style={styles.light} />,
  lightitalic: <Text style={styles.lightitalic} />,
  regular: <Text style={styles.regular} />,
  italic: <Text style={styles.italic} />,
  medium: <Text style={styles.medium} />,
  mediumitalic: <Text style={styles.mediumitalic} />,
  semibold: <Text style={styles.semibold} />,
  semibolditalic: <Text style={styles.semibolditalic} />,
  bold: <Text style={styles.bold} />,
  bolditalic: <Text style={styles.bolditalic} />,
  extrabold: <Text style={styles.extrabold} />,
  extrabolditalic: <Text style={styles.extrabolditalic} />,
  black: <Text style={styles.black} />,
  blackitalic: <Text style={styles.blackitalic} />,
}
