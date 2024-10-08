import React, { PropsWithChildren, useMemo } from 'react'
import { type FieldError } from 'react-hook-form'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { AvailableTextStyles, AvailableTranslations } from '../../../components/translated-text/types'
import { TestId, useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export type FormFieldContainerProps = PropsWithChildren<{
  testID: TestId
  labelI18nKey?: AvailableTranslations
  labelTextStyle?: AvailableTextStyles
  error?: FieldError
  ignoredErrorTypes?: [FieldError['type']]
  containerStyle?: ViewStyle
  isRequired?: boolean
  disableAccessibilityForLabel?: boolean
}>

export const FormFieldContainer: React.FC<FormFieldContainerProps> = ({
  testID,
  labelI18nKey,
  labelTextStyle = 'BodyRegular',
  error,
  ignoredErrorTypes,
  containerStyle,
  isRequired,
  disableAccessibilityForLabel,
  children,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { addTestIdModifier } = useTestIdBuilder()
  const [textStyles] = useTextStyles()

  const errorMessage: string | undefined = useMemo(() => {
    if (error && (ignoredErrorTypes === undefined || !ignoredErrorTypes.includes(error.type))) {
      return error.message ?? t(`form_error_${error.type}` as any) ?? t('form_error_fallback')
    } else {
      return undefined
    }
  }, [error, ignoredErrorTypes, t])

  return (
    <View style={[styles.container, containerStyle]}>
      {labelI18nKey && (
        <Text
          testID={addTestIdModifier(testID, 'label')}
          accessibilityLabel={t(labelI18nKey)}
          accessible={!disableAccessibilityForLabel}
          importantForAccessibility={disableAccessibilityForLabel ? 'no' : undefined}
          style={[textStyles[labelTextStyle], { color: colors.labelColor }]}>
          {t(labelI18nKey) + (isRequired ? ' *' : '')}
        </Text>
      )}
      <View style={styles.textInputContainer}>{children}</View>
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <SvgImage type="input-error" width={20} height={20} />
          <Text
            testID={addTestIdModifier(testID, 'error')}
            accessibilityLabel={errorMessage}
            accessible
            style={[textStyles.CaptionSemibold, styles.errorText, { color: colors.labelColor }]}>
            {errorMessage}
          </Text>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[6],
  },
  textInputContainer: {
    marginTop: spacing[2],
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  errorText: {
    marginLeft: spacing[2],
    // This marginTop does not exist in Figma, but it makes the text properly center aligned with the icon
    marginTop: spacing[1],
    flex: 1,
  },
})
