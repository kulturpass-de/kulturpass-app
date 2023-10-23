import React from 'react'
import { StyleSheet } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { TranslatedText, type TranslatedTextProps } from '../translated-text/translated-text'

export type AlertTitleProps = Omit<TranslatedTextProps, 'textStyle'>

export const AlertTitle = ({ textStyleOverrides, ...props }: AlertTitleProps) => {
  return (
    <TranslatedText
      {...props}
      textStyle="HeadlineH3Extrabold"
      textStyleOverrides={[styles.container, textStyleOverrides]}
    />
  )
}

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[5],
    color: colors.moonDarkest,
    textAlign: 'center',
  },
})
