import React from 'react'
import { StyleSheet } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { TranslatedText, type TranslatedTextProps } from '../translated-text/translated-text'

export type AlertMessageProps = Omit<TranslatedTextProps, 'textStyle'>

export const AlertMessage = ({ textStyleOverrides, ...props }: AlertMessageProps) => {
  return (
    <TranslatedText {...props} textStyle="BodyRegular" textStyleOverrides={[styles.container, textStyleOverrides]} />
  )
}

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[8],
    color: colors.moonDarker,
  },
})
