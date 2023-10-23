import React from 'react'
import { Pressable, PressableProps, StyleSheet, View } from 'react-native'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export type ChipProps = Omit<PressableProps, 'onPress'> & {
  i18nKey: AvailableTranslations
  i18nParams?: {}
  active?: boolean
  disabled?: boolean
  onPress?: () => void
}

export const Chip = ({ i18nKey, i18nParams, active, disabled, onPress, ...pressableProps }: ChipProps) => {
  const { colors } = useTheme()
  return (
    <Pressable {...pressableProps} onPress={disabled ? undefined : onPress}>
      <View
        style={[
          styles.container,
          { borderColor: colors.chipBorder },
          { backgroundColor: active ? colors.chipBackgroundActive : colors.chipBackground },
          disabled && styles.disabled,
        ]}>
        <TranslatedText
          i18nKey={i18nKey}
          i18nParams={i18nParams}
          textStyle="BodyPrimary1Dark"
          textStyleOverrides={[
            styles.text,
            {
              color: active ? colors.chipTextActive : colors.chipText,
            },
          ]}
        />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 99,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  text: {
    fontSize: 14.8,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  disabled: {
    opacity: 0.5,
  },
})
