import React from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { TranslatedText, type TranslatedTextProps } from '../translated-text/translated-text'

export type AlertMessageProps = Omit<TranslatedTextProps, 'textStyle'>

export const AlertMessage = ({ textStyleOverrides, ...props }: AlertMessageProps) => {
  const { colors } = useTheme()
  return (
    <TranslatedText
      {...props}
      textStyle="BodyRegular"
      textStyleOverrides={[styles.container, { color: colors.labelColor }, textStyleOverrides]}
    />
  )
}

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[8],
  },
})
