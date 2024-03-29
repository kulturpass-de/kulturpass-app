import React, { forwardRef } from 'react'
import { Text, type StyleProp, type TextStyle, AccessibilityProps } from 'react-native'
import { TestId } from '../../services/test-id/test-id'
import { useTranslation, Trans } from '../../services/translation/translation'
import { useTextStyles } from '../../theme/hooks/use-text-styles'
import { applyAccessibilityReplacements } from './accessibility-replacements'
import { AvailableTextStyles, AvailableTranslations } from './types'

export type TranslatedTextProps = {
  i18nKey: AvailableTranslations
  i18nParams?: {}
  textStyle: AvailableTextStyles
  textStyleOverrides?: StyleProp<TextStyle>
  testID?: TestId
  customComponents?: Record<string, React.ReactElement>
  accessibilityRole?: AccessibilityProps['accessibilityRole']
}

export const TranslatedText = forwardRef<Text, TranslatedTextProps>(
  (
    { i18nKey, i18nParams, textStyle, textStyleOverrides = {}, testID, customComponents, accessibilityRole = 'text' },
    ref: React.ForwardedRef<Text>,
  ) => {
    const { t } = useTranslation()
    const [textStyles, translatedTextStyles, translatedTextComponents] = useTextStyles()
    let accessibilityLabel = i18nParams ? t(i18nKey, i18nParams) : t(i18nKey)
    accessibilityLabel = applyAccessibilityReplacements(accessibilityLabel)

    return (
      <Text
        ref={ref}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessible
        accessibilityRole={accessibilityRole}
        style={[translatedTextStyles.base, textStyles[textStyle], textStyleOverrides]}>
        <Trans
          i18nKey={i18nKey as any}
          values={i18nParams}
          components={{ ...translatedTextComponents, ...customComponents }}
        />
      </Text>
    )
  },
)
