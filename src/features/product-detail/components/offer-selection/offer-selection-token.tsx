import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TranslatedText } from '../../../../components/translated-text/translated-text'
import { AvailableTextStyles, AvailableTranslations } from '../../../../components/translated-text/types'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { spacing } from '../../../../theme/spacing'
import { textStyles } from '../../../../theme/typography'

type OfferSelectionTokenProps = {
  i18nKey?: AvailableTranslations
  i18nParams?: {}
  disabled?: boolean
  customText?: string
}

const textStyle: AvailableTextStyles = 'BodyPrimary1Dark'

export const OfferSelectionToken = ({ i18nKey, i18nParams, disabled, customText }: OfferSelectionTokenProps) => {
  const { colors } = useTheme()

  const textStyleOverrides = { color: disabled ? colors.tokenTextDisabled : colors.tokenText }

  return (
    <View style={[styles.token, { backgroundColor: colors.tokenBackground }]}>
      {customText || !i18nKey ? (
        <Text style={[textStyles[textStyle], textStyleOverrides]}>{customText}</Text>
      ) : (
        <TranslatedText
          i18nKey={i18nKey}
          i18nParams={i18nParams}
          textStyle={textStyle}
          textStyleOverrides={textStyleOverrides}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  token: {
    borderRadius: 99,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1],
  },
})
